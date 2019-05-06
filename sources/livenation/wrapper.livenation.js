// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');
const $ = require('cheerio');

const namesUtils = require('../../utils/names.utils');
const datesUtils = require('../../utils/dates.utils');

// Export module functions
module.exports.getArtistConcerts = getArtistConcerts;


// Query the Live Nation search API with the name of the artist to get its profile page
async function searchArtist(artistName) {
    // Define request headers
    let headers = {
        'Content-Type' : 'application/json',
        'Host' : 'www.livenation.it',
        'Referer' : 'https://www.livenation.it/search'
    };

    // Define query parameters
    let data = {
        'keyword' : artistName,
        'limit' : 100
    };

    try {
        let response = await axios.get(`https://www.livenation.it/search/results`, {headers : headers, params : data});
        let results = response.data.results;

        let artist = results.find(element => namesUtils.normalize(element.name) === namesUtils.normalize(artistName));
        return artist ? artist.url : undefined;
    } catch (err) {
        logger.error(`Error occurred querying Live Nation API - ${err}`);
    }
}


// Query the Live Nation website with an artist name to get the list of concerts
async function getArtistConcerts(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let artistPage = await searchArtist(artistName);

    if (!artistPage) {
        logger.silly(`No artist page found on Live Nation for ${artistName}`);
        return undefined;
    }

    try {
        let response = await axios.get(`https://www.livenation.it${artistPage}`);
        let html = response.data;

        let rows = $('div#national > ul > li.artistticket', html);
        let concerts = [];

        rows.each((i, element) => {
            let day = $(element).find('div.artistticket__date > span.date__day').text();
            let month = $(element).find('div.artistticket__date > span.date__month').text().trim().substring(0, 3);
            let year = $(element).find('div.artistticket__date > span.date__month').text().trim().substring(4);

            let time = $(element).find('div.artistticket__date > span.date__time');

            let hours = 0;
            let mins = 0;

            if (time.length !== 0) {
                hours = $(time).text().trim().substring(0, 2);
                mins = $(time).text().trim().substring(3);
            }

            let date = new Date(Date.UTC(year, datesUtils.months[month.toLowerCase()], day, hours - 2, mins));

            let venue = $(element).find('h4.artistticket__venue').text().trim();
            let city = $(element).find('h5.artistticket__city').text().trim();

            concerts.push({
                artist : artistName,
                date : date,
                place : `${venue} - ${city}`
            })
        });

        return concerts;
    } catch (err) {
        logger.error(`Error occurred scraping Live Nation website - ${err}`);
    }

}
