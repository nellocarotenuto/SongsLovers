// Module dependencies
const logger = require('../../config/logger');

const SearchResults = require('./search.model');

// Export module functions
module.exports.getSearchResultsFromCache = getSearchResultsFromCache;
module.exports.saveSearchResultsToCache = saveSearchResultsToCache;
module.exports.updateSearchResultsInCache = updateSearchResultsInCache;

async function getSearchResultsFromCache(query) {
    try {
        return await SearchResults.findOne({query : query}, { _id: 0, __v: 0, 'artists._id': 0});
    } catch(err) {
        logger.error(`Error occurred while getting search results for "${query}" from cache - ${err}`);
    }
}

async function saveSearchResultsToCache(results) {
    try {
        await SearchResults.create(results);
    } catch(err) {
        logger.error(`Error occurred while saving search results for "${results.query}" to cache - ${err}`);
    }
}

async function updateSearchResultsInCache(results) {
    try {
        let result = await SearchResults.updateOne({id : results.id}, results);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating search results for "${results.query}" in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while updating search results for "${results.query}" in cache - ${err}`);
    }
}
