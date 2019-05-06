// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');

const namesUtils = require('../../utils/names.utils');

const API_URL = 'https://it.wikipedia.org/w/api.php';

module.exports.getArtistPage = getArtistPage;

// Query the Wikipedia search API with the name of the artist to get all results
async function searchArtistPage(artistName) {

    let params = {
        'action' : 'query',
        'list' : 'search',
        'srsearch' : artistName,
        'format' : 'json'
    };

    try {
        let response = await axios.get(API_URL, {params : params});
        let results = [];

        for (let item of response.data.query.search) {
            results.push(item.pageid);
        }

        return results;
    } catch (err) {
        logger.error(`Error occurred querying Wikipedia API - ${err}`);
    }

}

// Query the Wikipedia search API with the name of the artist to get its wiki page
async function getArtistPage(artistName) {

    if (!artistName) {
        throw "Artist name must be defined";
    }

    let artistWikiPage = await searchArtistPage(artistName);

    if (artistWikiPage.length === 0) {
        logger.silly(`No results found on Wikipedia for "${artistName}"`);
        return undefined;
    }

    try {
        let results = [];

        let params = {
            'action' : 'query',
            'prop' : 'templates|extracts|info',
            'inprop' : 'url',
            'exintro' : '1',
            'explaintext' : '1',
            'tltemplates' : 'Template:Artista musicale',
            'format' : 'json'
        };

        for (let pageId of artistWikiPage) {
            params.pageids = pageId;

            let response = await axios.get(API_URL, {params : params});
            let page = response.data.query.pages[pageId];

            if (page.templates) {
                if (namesUtils.normalize(page.title).includes(namesUtils.normalize(artistName))) {
                    results.push({
                        artist : artistName,
                        description : page.extract,
                        link : page.fullurl
                    });

                    break;
                }
            }
        }

        if (!results) {
            logger.silly(`No artist page found on Wikipedia for ${artistName}`);
            return undefined;
        }

        return results;
    } catch (err) {
        logger.error(`Error occurred querying Wikipedia API - ${err}`);
    }

}