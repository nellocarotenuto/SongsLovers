// Module dependencies
const logger = require('../../config/logger');
const manager = require('./news.manager');

const rockol = require('../../sources/rockol/rockol.wrapper');
const rollingStone = require('../../sources/rollingstone/rollingstone.wrapper');
const soundsBlog = require('../../sources/soundsblog/soundsblog.wrapper');

const artistService = require('../artists/artists.service');

// Define how often to update the info (1 days)
const VALIDITY = 1000 * 60 * 60 * 24;

//Define the name of the sources
const ROCKOL_NAME = 'Rockol';
const ROLLINGSTONE_NAME = 'RollingStone';
const SOUNDSBLOG_NAME = 'SoundsBlog';

// Export module functions
module.exports.getNews = getNews;

async function getNews(id) {
    try {
        let artist = await artistService.getArtist(id);

        let news = await manager.getNewsFromCache(artist);

        if (!news) {
            logger.verbose(`News for artist ${id} is not in cache`);
            news = await fetchNews(artist);

            await manager.saveNewsToCache(news);
            logger.verbose(`News for artist ${id} has been saved to cache`);
        } else if (new Date(news.updated) < Date.now() - VALIDITY) {
            logger.verbose(`News for artist ${id} is in cache but not up to date`);
            news = await fetchNews(artist);

            await manager.deleteNewsInCache(artist);

            await manager.saveNewsToCache(news);
            logger.verbose(`News for artist ${id} has been updated in cache`);
        }

        return news;
    } catch (err) {
        logger.error(`Error occurred getting the artist ${id} - ${err}`);
    }
}

async function fetchNews(artist) {
    try {
        let rockolInfo,rollingstoneInfo, soundsblogInfo;

        [rockolInfo, rollingstoneInfo, soundsblogInfo] = await Promise.all([rockol.getArtistNews(artist.name),
            rollingStone.getArtistNews(artist.name), soundsBlog.getArtistNews(artist.name)]);

        for (let rockolNews of rockolInfo) {
            rockolNews.source = ROCKOL_NAME;
        }

        for (let rollingstoneNews of rollingstoneInfo) {
            rollingstoneNews.source = ROLLINGSTONE_NAME;
        }

        for (let soundsblogNews of soundsblogInfo) {
            soundsblogNews.source = SOUNDSBLOG_NAME;
        }

        let news = rockolInfo.concat(rollingstoneInfo).concat(soundsblogInfo).sort((news1, news2) => {
                return new Date(news2.date) - new Date(news1.date);
        });

        return {
            artist : {
                id : artist.id,
                name : artist.name,
            },
            news : news,
            updated : new Date(Date.now())
        };
    } catch (err) {
        logger.error(`Error occurred while fetching updated news about the artist ${artist.id} - ${err}`);
    }
}