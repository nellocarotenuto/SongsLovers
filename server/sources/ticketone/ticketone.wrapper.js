// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const $ = require('cheerio');
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();
const namesUtils = require('../../utils/names.utils');

const baseUrl = `http://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_TOKEN}&url=`;


// Export module functions
module.exports.getArtistConcertsAndTickets = getArtistConcertsAndTickets;


async function getArtistConcertsAndTickets(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    try {
        let artistPage = await getArtistProfile(artistName);
        let series = await getArtistEventSeries(artistPage);

        let concerts = [];

        for (let event of series) {
            concerts = concerts.concat(await getEventConcerts(artistName, event));
        }

        return concerts;
    } catch (err) {
        logger.error(`Error occurred querying TicketOne website - ${err}`);
    }

}


// Query the TicketOne website with an artist name to get the link to the profile page
async function getArtistProfile(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let url = encodeURIComponent(`https://www.ticketone.it/biglietti.html?suchbegriff=${artistName}&fun=search&doc=search&action=grouped`);

    try {
        let response = await axios.get(baseUrl + url);

        if (response.status !== 200) {
            logger.warn(`Something went wrong querying TicketOne website - Status code: ${response.status}`);
        }

        let html = response.data;

        let rows = $('ul#searchResultList > li[id*="artist-"]', html);
        let artists = [];

        rows.each((i, element) => {
            artists.push({
                name : $(element).find('a.item-header-link').attr('title'),
                href : $(element).find('a.item-header-link').attr('href')
            });
        });

        let artist = artists.find(element => namesUtils.normalize(element.name) === namesUtils.normalize(artistName));

        return artist ? artist.href : undefined;
    } catch (err) {
        logger.error(`Error occurred querying TicketOne website - ${err}`);
    }

}


// Get the links to TicketOne pages for event series for a given artist profile
async function getArtistEventSeries(artistProfileUrl) {

    if (!artistProfileUrl) {
        throw 'Artist profile page must be defined';
    }

    let url = encodeURIComponent(`https://www.ticketone.it/${artistProfileUrl}`);

    try {
        let response = await axios.get(baseUrl + url);

        if (response.status !== 200) {
            logger.warn(`Something went wrong querying TicketOne website - Status code: ${response.status}`);
        }

        let html = response.data;

        let rows = $('div#overviewTeaser div.ticketsButton > a.sdb', html);
        let series = [];

        rows.each((i, element) => {
            series.push($(element).attr('href'));
        });

        return series;
    } catch (err) {
        logger.error(`Error occurred querying TicketOne website - ${err}`);
    }
}


async function getEventConcerts(artistName, eventUrl) {

    if (!artistName || !eventUrl) {
        throw 'Artist name and event series page URL must be defined';
    }

    try {
        let url = encodeURIComponent(`https://www.ticketone.it/${eventUrl}`);

        let page = 1;
        let numberOfItems;
        let numberOfPages;

        let response;
        let html;
        let rows;

        let concerts = [];

        do {
            response = await axios.get(baseUrl + url);

            if (response.status !== 200) {
                logger.warn(`Something went wrong querying TicketOne website - Status code: ${response.status}`);
            }

            html = response.data;

            numberOfItems = $('div#yTix > table > tfoot > tr.last > td.orderBtn strong:last-child', html).text();
            numberOfPages = Math.ceil(numberOfItems / 20);

            rows = $('div#yTix > table > tbody > tr', html);

            rows.each((i, element) => {
                let dateString = $(element).find('td.col-date').text().trim();
                let locationHtml = $(element).find('td.col-location > span').html();
                let availabilityElement = $(element).find('td dl.availability').find('dd');
                let link = $(element).find('td.ticketBtn > a').attr('href');

                let city = entities.decode(locationHtml.split('<br>')[0].trim());
                let venue = entities.decode(locationHtml.split('<br>')[1].trim());

                let day = dateString.substring(5, 7);
                let month = dateString.substring(8, 10) - 1;
                let year = 2000 + parseInt(dateString.substring(11, 13));

                let date = new Date(Date.UTC(year, month, day, - 2, 0));
                let place = `${venue} - ${city}`;

                let price = 0;

                if ($(availabilityElement).hasClass('available') && $(availabilityElement).find('span').length > 0) {
                    price = $(availabilityElement).find('span').text().trim().substring(2).replace(',','.');
                    price = parseFloat(price);
                }

                let concert = concerts.find((concert) => {
                    return concert.place === place &&
                           concert.date.getFullYear() === date.getFullYear() &&
                           concert.date.getMonth() === date.getMonth() &&
                           concert.date.getDate() === date.getDate();
                });

                if (!concert) {
                    concerts.push({
                        artist: artistName,
                        date: date,
                        place: place,
                        link: `https://www.ticketone.it/${link}`,
                        price: price > 0 ? price : undefined
                    });
                }
            });

            if (page < numberOfPages) {
                url = encodeURIComponent(`https://www.ticketone.it/${eventUrl}&index_ytix=${page * 20}`);
            }

            page++;
        } while (page <= numberOfPages);

        return concerts;
    }  catch (err) {
        logger.error(`Error occurred querying TicketOne website - ${err}`);
    }

}
