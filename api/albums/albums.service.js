// Module dependencies
const logger = require('../../config/logger');
const manager = require('./albums.manager');

const spotify = require('../../sources/spotify/spotify.wrapper');

// Define how often to update the info (7 days)
const VALIDITY = 1000 * 60 * 60 * 24 * 7;

// Export module functions
module.exports.getAlbum = getAlbum;
module.exports.getArtistAlbums = getArtistAlbums;

async function getAlbum(id) {
    try {
        let album = await manager.getAlbumFromCache(id);

        if (!album) {
            logger.verbose(`Album ${id} is not in cache`);
            album = await spotify.fetchAlbum(id);

            if (!album) {
                return undefined;
            }

            await manager.saveAlbumToCache(album);
            logger.verbose(`Album ${id} has been saved to cache`);
        } else if (album.updated < Date.now() - VALIDITY) {
            logger.verbose(`Album ${id} is in cache but not up to date`);
            album = await spotify.fetchAlbum(id);
            album.updated = new Date(Date.now());

            await manager.updateAlbumInCache(album);
            logger.verbose(`Album ${id} has been updated in cache`);
        }

        return album;
    } catch (err) {
        logger.error(`Error occurred getting the album ${id} - ${err}`);
    }
}

async function getArtistAlbums(id) {
    try {
        return await spotify.fetchAlbums(id);
    } catch (err) {
        logger.error(`Error occurred getting albums for the artist ${artistSpotifyId} - ${err}`);
    }
}
