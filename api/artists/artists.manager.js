// Module dependencies
const logger = require('../../config/logger');
const spotify = require('../../sources/spotify/spotify.wrapper');

const Artist = require('./artists.model');

// Export module functions
module.exports.getArtistFromCache = getArtistFromCache;
module.exports.saveArtistToCache = saveArtistToCache;
module.exports.updateArtistInCache = updateArtistInCache;

async function getArtistFromCache(spotifyId) {
    try {
        return await Artist.findOne({spotifyId : spotifyId}, '-_id -__v');
    } catch(err) {
        logger.error(`Error occurred while getting the artist ${spotifyId} from cache - ${err}`);
    }
}

async function saveArtistToCache(artist) {
    try {
        await Artist.create(artist);
    } catch(err) {
        logger.error(`Error occurred while saving the artist ${artist.spotifyId} to cache - ${err}`);
    }
}

async function updateArtistInCache(artist) {
    try {
        let result = await Artist.updateOne({spotifyId : artist.spotifyId}, artist);

        if (result.nModified !== 1) {
            logger.warn(`Something went wrong when updating the artist ${artist.spotifyId} in cache`);
        }
    } catch(err) {
        logger.error(`Error occurred while updating the artist ${artist.spotifyId} in cache - ${err}`);
    }
}
