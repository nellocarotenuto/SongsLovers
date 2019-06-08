// Module dependencies
const logger = require('../../config/logger');
const manager = require('./tracks.manager');

const spotify = require('../../sources/spotify/spotify.wrapper');
const genius = require('../../sources/genius/genius.wrapper');

// Define how often to update the info (7 days)
const VALIDITY = 1000 * 60 * 60 * 24 * 7;

// Export module functions
module.exports.getTrack = getTrack;

async function getTrack(id) {
    try {
        let track = await manager.getTrackFromCache(id);

        if (!track) {
            logger.verbose(`Track ${id} is not in cache`);
            track = await fetchTrack(id);

            if (!track) {
                return undefined;
            }

            await manager.saveTrackToCache(track);
            logger.verbose(`Track ${id} has been saved to cache`);
        } else if (track.updated < Date.now() - VALIDITY) {
            logger.verbose(`Track ${id} is in cache but not up to date`);
            track = await fetchTrack(id);
            track.updated(new Date(Date.now()));

            await manager.updateTrackInCache(track);
            logger.verbose(`Track ${id} has been updated in cache`);
        }

        return track;
    } catch (err) {
        logger.error(`Error occurred getting the track ${id} - ${err}`);
    }
}

async function fetchTrack(id) {
    try {
        let spotifyInfo = await spotify.fetchTrack(id);

        if (!spotifyInfo) {
            return undefined;
        }

        let title = spotifyInfo.name.indexOf('(feat.') !== -1 ? spotifyInfo.name.substring(0, spotifyInfo.name.indexOf('(feat.')) : spotifyInfo.name;

        let geniusInfo = await genius.getSongLyrics(title, spotifyInfo.artists[0].name);

        return {
            id : spotifyInfo.id,
            name : spotifyInfo.name,
            artists : spotifyInfo.artists,
            album : spotifyInfo.album,
            duration : spotifyInfo.duration,
            explicit : spotifyInfo.explicit,
            number : spotifyInfo.number,
            spotify : spotifyInfo.url,
            lyrics : geniusInfo ? geniusInfo.lyrics : undefined,
            video : geniusInfo ? geniusInfo.video : undefined,
            updated : new Date(Date.now())
        }
    } catch (err) {
        logger.error(`Error occurred while fetching updated info about the track ${id} - ${err}`);
    }
}
