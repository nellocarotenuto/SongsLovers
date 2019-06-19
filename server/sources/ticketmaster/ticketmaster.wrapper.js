// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');

const namesUtils = require('../../utils/names.utils');


// Export module functions
module.exports.getArtistConcertsAndTickets = getArtistConcertsAndTickets;


// Query the Ticketmaster API with an artist name to get the concerts info
async function getArtistConcertsAndTickets(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    // Define request headers
    let headers = {
        'Content-Type' : 'application/json',
        'Host' : 'api.att.ticketmaster.it',
        'Origin' : 'https://www.ticketmaster.it',
        'Referer' : 'https://www.ticketmaster.it/'
    };

    // Define query parameters
    let data = {
        'SearchText' : artistName,
        'LanguageCode' : 'it',
        'PageNumber' : 1,
        'PageSize' : 20
    };

    try {
        let response = await axios.post(`https://api.att.ticketmaster.it/api/events/search`, data, {headers : headers});
        let events = response.data.Data;
        let concerts = [];

        for (let item of events) {
            concerts.push({
                artist : artistName,
                date : item.Date,
                place : item.Location,
                link : `https://www.ticketmaster.it/event/${item.Slug}/${item.EventWebId}`,
                price : item.PriceFrom !== 0 ? item.PriceFrom : undefined
            });
        }

        return concerts;
    } catch (err) {
        logger.error(`Error occurred querying Ticketmaster API - ${err}`);
    }

}
