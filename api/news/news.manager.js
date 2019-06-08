// Module dependencies
const logger = require('../../config/logger');

const News = require('./news.model');

// Export module functions
module.exports.getNewsFromCache = getNewsFromCache;
module.exports.saveNewsToCache = saveNewsToCache;
module.exports.deleteNewsInCache = deleteNewsInCache;

async function getNewsFromCache(artist) {
    try {
        return await News.findOne({
            artist:
                {
                    id: artist.id,
                    name: artist.name
                }
        }, '-_id -__v');
    } catch(err) {
        logger.error(`Error occurred while getting the news for artist ${artist.id} from cache - ${err}`);
    }
}

async function saveNewsToCache(news) {
    try {
        await News.create(news);
    } catch(err) {
        logger.error(`Error occurred while saving the news for artist ${news.artist} to cache - ${err}`);
    }
}

async function deleteNewsInCache(artist) {
    try {
        await News.deleteOne({
            artist:
                {
                    id: artist.id,
                    name: artist.name
                }
        });
    } catch(err) {
        logger.error(`Error occurred while deleting the news for artist ${id} from cache - ${err}`)
    }
}
