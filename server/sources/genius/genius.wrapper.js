// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const namesUtils = require('../../utils/names.utils');
const $ = require('cheerio');


// Export module functions
module.exports.getArtistSocialInfo = getArtistSocialInfo;
module.exports.getSongLyrics = getSongLyrics;


async function getArtistSocialInfo(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let headers = {
        'Content-Type' : 'application/json',
        'Host' : 'genius.com'
    };

    let params = {
        'q' : artistName
    };

    let response;

    try {
        response = await axios.get(`https://genius.com/api/search/artists`, {headers : headers, params : params});
        let artists = response.data.response.sections[0].hits;

        let searchResult = artists.find(element => namesUtils.normalize(element.result.name) === namesUtils.normalize(artistName));

        if (!searchResult) {
            logger.silly(`No artist page found on Genius for ${artistName}`);
            return undefined;
        }

        response = await axios.get(`https://genius.com/api${searchResult.result.api_path}`, {headers : headers});

        let artist = response.data.response.artist;

        return {
            name : artistName,
            facebook : artist.facebook_name,
            twitter : artist.twitter_name,
            instagram : artist.instagram_name
        };
    } catch (err) {
        logger.error(`Error occurred querying Genius API - ${err}`);
    }
}


async function getSongLyrics(title, artists) {

    if (!title || !artists || artists.length === 0) {
        throw 'Artist names must be defined';
    }

    let headers = {
        'Content-Type' : 'application/json',
        'Host' : 'genius.com'
    };

    let params = {
        'q' : title,
        'page' : 1
    };

    let response;

    let songs;
    let song;

    try {
        do {
            response = await axios.get(`https://genius.com/api/search/songs`, {headers: headers, params: params});
            songs = response.data.response.sections[0].hits;

            if (songs.length === 0) {
                logger.silly(`No song found for "${title}" by "${artists[0]}"`);
                return undefined;
            }

            song = songs.find((element) => {
                let artistMatch = false;

                for (let artist of artists) {
                    if (namesUtils.normalize(element.result.primary_artist.name) === namesUtils.normalize(artist)) {
                        artistMatch = true;
                        break;
                    }
                }

                return namesUtils.normalize(element.result.title) === namesUtils.normalize(title) && artistMatch;
            });

            if (song) {
                response = await axios.get(song.result.url, {headers : headers});
                let html = response.data;

                let pagedata = JSON.parse($('meta[itemprop="page_data"]', html).attr('content'));
                let url = pagedata.song.youtube_url;

                let lyrics = $('div.lyrics p', html).text();

                return {
                    artist : artists,
                    title : title,
                    lyrics : lyrics,
                    video : url
                };
            }

            params.page++;
        } while (!song && page < 7);

        return undefined;
    } catch (err) {
            logger.error(`Error occurred querying Genius website - ${err}`);
    }

}
