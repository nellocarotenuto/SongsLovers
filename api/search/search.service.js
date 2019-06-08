// Module dependencies
const logger = require('../../config/logger');
const manager = require('./search.manager');

const spotify = require('../../sources/spotify/spotify.wrapper');

// Define how often to update the info (1 day)
const VALIDITY = 1000 * 60 * 60 * 24;

// Export module functions
module.exports.getResults = getResults;

async function getResults(name) {
    try {
        let results = await manager.getSearchResultsFromCache(name);

        if (!results) {
            logger.verbose(`Search results for "${name}" are not in cache`);
            results = await fetchResults(name);

            await manager.saveSearchResultsToCache(results);
            logger.verbose(`Search results for "${name}" have been saved to cache`);
        } else if (results.updated < Date.now() - VALIDITY) {
            logger.verbose(`Search results for "${name}" are in cache but not up to date`);
            results = await fetchResults(name);
            results.updated = new Date(Date.now());

            await manager.updateSearchResultsInCache(results);
            logger.verbose(`Search results for "${name}" have been updated in cache`);
        }

        return results;
    } catch (err) {
        logger.error(`Error occurred searching for ${name} - ${err}`);
    }
}

async function fetchResults(name) {
    let artists = await spotify.searchArtists(name);

    return {
        query : name,
        artists : artists
    };
}
