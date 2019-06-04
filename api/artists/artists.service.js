// Module dependencies
const logger = require('../../config/logger');
const manager = require('./artists.manager');

const spotify = require('../../sources/spotify/spotify.wrapper');
const genius = require('../../sources/genius/genius.wrapper');
const wikipedia = require('../../sources/wikipedia/wikipedia.wrapper');

// Define how often to update the info (30 days)
const VALIDITY = 1000 * 60 * 60 * 24 * 30;

// Export module functions
module.exports.getArtist = getArtist;

async function getArtist(spotifyId) {
    try {
        let artist = await manager.getArtistFromCache(spotifyId);

        if (!artist) {
            logger.verbose(`Artist ${spotifyId} is not in cache`);
            artist = await fetchArtist(spotifyId);

            await manager.saveArtistToCache(artist);
            logger.verbose(`Artist ${spotifyId} has been saved to cache`);
        } else if (artist.updated < Date.now() - VALIDITY) {
            logger.verbose(`Artist ${spotifyId} is in cache but not up to date`);
            artist = await fetchArtist(spotifyId);

            await manager.updateArtistInCache(artist);
            logger.verbose(`Artist ${spotifyId} has been updated in cache`);
        }

        return artist;
    } catch (err) {
        logger.error(`Error occurred getting the artist ${spotifyId} - ${err}`);
    }
}

async function fetchArtist(spotifyId) {
    try {
        let spotifyInfo = await spotify.fetchArtist(spotifyId);

        [geniusInfo, wikipediaInfo] = await Promise.all([genius.getArtistSocialInfo(spotifyInfo.name),
                                                                wikipedia.getArtistPage(spotifyInfo.name)]);

        return {
            name : spotifyInfo.name,
            picture : spotifyInfo.picture,
            bio : wikipediaInfo.description,
            genres : spotifyInfo.genres,
            spotifyId : spotifyInfo.id,
            twitter : geniusInfo.twitter,
            facebook : geniusInfo.facebook,
            instagram : geniusInfo.instagram,
            wikipedia : wikipediaInfo.link,
            updated : Date.now()
        }
    } catch (err) {
        logger.error(`Error occurred while fetching updated info about the artist ${spotifyId} - ${err}`);
    }
}