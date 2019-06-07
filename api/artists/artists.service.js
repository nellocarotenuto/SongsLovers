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
module.exports.getSimplifiedArtist = getSimplifiedArtist;

async function getArtist(id) {
    try {
        let artist = await manager.getArtistFromCache(id);

        if (!artist) {
            logger.verbose(`Artist ${id} is not in cache`);
            artist = await fetchArtist(id);

            await manager.saveArtistToCache(artist);
            logger.verbose(`Artist ${id} has been saved to cache`);
        } else if (artist.updated < Date.now() - VALIDITY) {
            logger.verbose(`Artist ${id} is in cache but not up to date`);
            artist = await fetchArtist(id);

            await manager.updateArtistInCache(artist);
            logger.verbose(`Artist ${id} has been updated in cache`);
        }

        return artist;
    } catch (err) {
        logger.error(`Error occurred getting the artist ${id} - ${err}`);
    }
}

async function getSimplifiedArtist(id) {
    try {
        let artist = await getArtist(id);

        return {
            _id : artist._id,
            name : artist.name
        }
    } catch (err) {
        logger.error(`Error occurred getting the simplified artist ${id} - ${err}`);
    }
}

async function fetchArtist(id) {
    try {
        let spotifyInfo = await spotify.fetchArtist(id);

        [geniusInfo, wikipediaInfo] = await Promise.all([genius.getArtistSocialInfo(spotifyInfo.name),
                                                                wikipedia.getArtistPage(spotifyInfo.name)]);

        return {
            id : id,
            name : spotifyInfo.name,
            picture : spotifyInfo.picture,
            bio : wikipediaInfo.description,
            genres : spotifyInfo.genres,
            twitter : geniusInfo.twitter,
            facebook : geniusInfo.facebook,
            instagram : geniusInfo.instagram,
            wikipedia : wikipediaInfo.link,
            updated : Date.now()
        }
    } catch (err) {
        logger.error(`Error occurred while fetching updated info about the artist ${id} - ${err}`);
    }
}
