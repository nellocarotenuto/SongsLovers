// Module dependencies
const logger = require('../../config/logger');
const manager = require('./concerts.manager');

const liveNation = require('../../sources/livenation/livenation.wrapper');
const vivoConcerti = require('../../sources/vivoconcerti/vivoconcerti.wrapper');

const ticketMaster = require('../../sources/ticketmaster/ticketmaster.wrapper');
const ticketOne = require('../../sources/ticketone/ticketone.wrapper');

const artistService = require('../artists/artists.service');

// Define how often to update the info (7 days)
const VALIDITY = 1000 * 60 * 60 * 24 * 7;

// Export module functions
module.exports.getConcert = getConcert;

async function getConcert(id) {
    try {
        let artist = await artistService.getArtist(id);

        let concert = await manager.getConcertFromCache(artist);

        if (!concert) {
            logger.verbose(`Concerts for artist ${id} is not in cache`);
            concert = await fetchConcert(artist);

            await manager.saveConcertToCache(concert);
            logger.verbose(`Concerts for artist ${id} has been saved to cache`);
        } else if (new Date(concert.updated) < Date.now() - VALIDITY) {
            logger.verbose(`Concerts for artist ${id} is in cache but not up to date`);
            concert = await fetchConcert(artist);

            await manager.updateConcertInCache(concert);
            logger.verbose(`Concerts for artist ${id} has been updated in cache`);
        }

        return concert;
    } catch (err) {
        logger.error(`Error occurred getting the artist ${id} - ${err}`);
    }
}

async function fetchConcert(artist) {
    try {
        let liveNationInfo, vivoConcertiInfo, ticketMasterInfo, ticketOneInfo;

        [liveNationInfo, vivoConcertiInfo] = await Promise.all([liveNation.getArtistConcerts(artist.name),
            vivoConcerti.getArtistConcerts(artist.name)]);

        [ticketMasterInfo, ticketOneInfo] = await Promise.all([ticketMaster.getArtistConcertsAndTickets(artist.name),
            ticketOne.getArtistConcertsAndTickets(artist.name)]);

        let concerts = liveNationInfo.concat(vivoConcertiInfo).sort((concert1, concert2) => {
            return new Date(concert1.date) - new Date(concert2.date);
        });

        for (let tickets of ticketMasterInfo) {
            tickets.source = 'TicketMaster';
        }

        for (let tickets of ticketOneInfo) {
            tickets.source = 'TicketOne';
        }

        let tickets = ticketMasterInfo.concat(ticketOneInfo);

        let result = [];

        for (let concert of concerts) {
            concert.tickets = [];

            let concertDate = new Date(Date.parse(concert.date));
            for (let ticket of tickets) {
                let ticketDate = new Date(Date.parse(ticket.date));

                if ((concertDate.getUTCDate() === ticketDate.getUTCDate()) &&
                    (concertDate.getUTCFullYear() === ticketDate.getUTCFullYear()) &&
                    (concertDate.getUTCMonth() === ticketDate.getUTCMonth())) {

                    concert.tickets.push({
                        seller : ticket.source,
                        link : ticket.link,
                        price : ticket.price
                    });
                }
            }

            result.push({
                date : concert.date,
                place : concert.place,
                tickets : concert.tickets
            });
        }

        return {
            artist : {
                id : artist.id,
                name : artist.name,
            },
            concerts : result,
            updated : new Date(Date.now())
        };
    } catch (err) {
        logger.error(`Error occurred while fetching updated concerts about the artist ${artist.id} - ${err}`);
    }
}