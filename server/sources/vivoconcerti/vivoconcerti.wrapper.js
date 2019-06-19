// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');
const $ = require('cheerio');

const namesUtils = require('../../utils/names.utils');

// Export module functions
module.exports.getArtistConcerts = getArtistConcerts;


// Query the Vivo Concerti search API with the name of the artist to get its profile page
async function searchArtist(artistName) {

    // Define request headers
    let headers = {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Host' : 'www.vivoconcerti.com',
        'Referer' : 'http://www.vivoconcerti.com/search'
    };

    // Define query parameters
    let data = {
        'title_contains' : artistName,
        'view_name' : 'artist',
        'view_display_id' : 'page',
        'page' : 0
    };

    try {
        let response = await axios.post(`http://www.vivoconcerti.com/views/ajax`, qs.stringify(data), {headers : headers});
        let html;

        for (let item of response.data) {
            if (item.command === 'insert') {
                html = item.data;
            }
        }

        let results = $('.view-content > .item-list > ul > li div.artistName a[href*="/artisti/"]', html);
        let urls = [];

        results.each((i, element) => {
            urls.push({
                href : $(element).attr('href'),
                name : $(element).text()
            });
        });

        let artist = urls.find(element => namesUtils.normalize(element.name) === namesUtils.normalize(artistName));

        return artist ? artist.href : undefined;
    } catch (err) {
        logger.error(`Error occurred querying Vivo Concerti API - ${err}`);
    }

}


// Query the Vivo Concerti website with an artist name to get the list of concerts
async function getArtistConcerts(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let artistPage = await searchArtist(artistName);

    if (!artistPage) {
        logger.silly(`No artist page found on Vivo Concerti for ${artistName}`);
        return [];
    }

    try {
        let response = await axios.get(`http://www.vivoconcerti.com${artistPage}`);
        let html = response.data;

        let rows = $('div#block-views-artist-block-15 div.middle.tb-terminal > div.content > div.view-display-id-block_15 div.item-list > ul > li > div.views-field.views-field-nothing > span', html);
        let concerts = [];

        rows.each((i, element) => {
            let date = $(element).find('span.date-display-single').attr('content');
            let place = $(element).find('div.calenderPlaceAndTime.bit-location').find('div.venueAndCity').text().trim().replace(/\s\s+/g, ' ');

            concerts.push({
                artist : artistName,
                date : date,
                place : place
            })
        });

        return concerts;
    } catch (err) {
        logger.error(`Error occurred scraping Vivo Concerti website - ${err}`);
    }

}
