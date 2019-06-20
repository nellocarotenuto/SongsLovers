// Module dependencies
const logger = require('../../config/logger');

const Track = require('./tracks.model');

// Export module functions
module.exports.getTrackFromCache = getTrackFromCache;
module.exports.saveTrackToCache = saveTrackToCache;
module.exports.updateTrackInCache = updateTrackInCache;

async function getTrackFromCache(id) {
    try {
        return await Track.findOne({id : id}, {_id: 0, __v: 0, 'artists._id': 0, 'album.artists._id': 0});
    } catch(err) {
        logger.error(`Error occurred while getting the track ${id} from cache - ${err}`);
    }
}

async function saveTrackToCache(track) {
    try {
        await Track.create(track);
    } catch(err) {
        logger.error(`Error occurred while saving the track ${track.id} to cache - ${err}`);
    }
}

async function updateTrackInCache(track) {
    try {
        let result = await Track.updateOne({id : track.id}, track);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating the track ${track.id} in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while updating the track ${track.id} in cache - ${err}`);
    }
}
