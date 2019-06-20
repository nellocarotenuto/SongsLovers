// Module dependencies
const logger = require('../../config/logger');

const News = require('./news.model');

// Export module functions
module.exports.getNewsFromCache = getNewsFromCache;
module.exports.saveNewsToCache = saveNewsToCache;
module.exports.updateNewsInCache = updateNewsInCache;

async function getNewsFromCache(artist) {
    try {
        return await News.findOne({
            artist :
                {
                    id : artist.id,
                    name : artist.name
                }
        }, { _id: 0, __v: 0, 'news._id': 0});
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

async function updateNewsInCache(news) {
    try {
        let result = await News.updateOne({artist : news.artist}, news);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating the news for artist ${news.artist.id} in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while updating the news for artist ${id} from cache - ${err}`)
    }
}
