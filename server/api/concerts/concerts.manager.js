// Module dependencies
const logger = require('../../config/logger');

const Concert = require('./concerts.model');

// Export module functions
module.exports.getConcertFromCache = getConcertFromCache;
module.exports.saveConcertToCache = saveConcertToCache;
module.exports.updateConcertInCache = updateConcertInCache;

async function getConcertFromCache(artist) {
    try {
        return await Concert.findOne({
            artist :
                {
                    id : artist.id,
                    name : artist.name
                }
        }, { _id: 0, __v: 0, 'concerts._id': 0, 'concerts.tickets._id': 0}).lean();
    } catch(err) {
        logger.error(`Error occurred while getting the concerts for artist ${artist.id} from cache - ${err}`);
    }
}

async function saveConcertToCache(concert) {
    try {
        await Concert.create(concert);
    } catch(err) {
        logger.error(`Error occurred while saving the concerts for artist ${concert.artist} to cache - ${err}`);
    }
}

async function updateConcertInCache(concert) {
    try {
        let result = await Concert.updateOne({artist : concert.artist}, concert);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating the news for artist ${concert.artist.id} in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while deleting the concerts for artist ${concert.artist.id} from cache - ${err}`)
    }
}