// Module dependencies
const logger = require('../../config/logger');

const Album = require('./albums.model');

// Export module functions
module.exports.getArtistAlbumsFromCache = getArtistAlbumsFromCache;
module.exports.getAlbumFromCache = getAlbumFromCache;
module.exports.saveAlbumToCache = saveAlbumToCache;
module.exports.updateAlbumInCache = updateAlbumInCache;

async function getArtistAlbumsFromCache(id) {
    try {
        return await Album.find({artists : {$elemMatch : {id : id}}}, '-_id -__v').lean();
    } catch(err) {
        logger.error(`Error occurred while getting the album ${id} from cache - ${err}`);
    }
}

async function getAlbumFromCache(id) {
    try {
        return await Album.findOne({id : id}, '-_id -__v').lean();
    } catch(err) {
        logger.error(`Error occurred while getting the album ${id} from cache - ${err}`);
    }
}

async function saveAlbumToCache(album) {
    try {
        await Album.create(album);
    } catch(err) {
        logger.error(`Error occurred while saving the album ${album.id} to cache - ${err}`);
    }
}

async function updateAlbumInCache(album) {
    try {
        let result = await Album.updateOne({id : album.id}, album);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating the album ${album.id} in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while updating the artist ${album.id} in cache - ${err}`);
    }
}
