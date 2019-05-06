// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');

const spotify = require('./auth.spotify');

// Export module functions
module.exports.searchArtists = searchArtists;
module.exports.fetchArtist = fetchArtist;
module.exports.fetchAlbums = fetchAlbums;
module.exports.fetchTracks = fetchTracks;


// Return request headers
async function getAuthHeaders() {

    // Authorize requests
    let {accessToken, tokenType} = await spotify.getToken();

    // Define authorization headers
    let headers = {
        'Authorization' : `${tokenType} ${accessToken}`
    };

    return headers;
}


// Query the Spotify API for artists of a given name and return a simplified artist object
async function searchArtists(name) {

    if (!name) {
        throw 'Artist name must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    // Define request parameters
    let params = {
        'q' : name,
        'type' : 'artist'
    };

    try {
        let response = await axios.get('https://api.spotify.com/v1/search', {headers : headers, params : params});
        let results = [];

        for (let item of response.data.artists.items) {
            results.push({
                name : item.name,
                spotify_id : item.id,
                picture : item.images[0] ? item.images[0].url : undefined
            });
        }

        return results;
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}


// Query the Spotify API for the artist of a given id and return all the relevant data
async function fetchArtist(id) {

    if (!id) {
        throw 'Artist ID must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    try {
        let response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {headers : headers});

        let artist = {
            id: response.data.id,
            name: response.data.name,
            genres: response.data.genres,
            picture: response.data.images[0] ? response.data.images[0].url : undefined
        };

        return artist;
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}

// Query the Spotify API for the albums of a given artist and return all the relevant data
async function fetchAlbums(artistId) {

    if (!artistId) {
        throw 'Artist ID must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    try {
        let response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {headers : headers});

        let albums = await Promise.all(response.data.items.map(async (item) => {
            let albumId = item.id;

            let response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {headers : headers});
            let artists = [];

            for (let artist of response.data.artists) {
                artists.push({
                    id : artist.id
                });
            }

            return {
                id : response.data.id,
                name : response.data.name,
                artists : artists,
                type : response.data.album_type,
                genres : response.data.genres,
                cover : response.data.images[0] ? response.data.images[0].url : undefined,
                date : response.data.release_date,
                url : response.data.external_urls.spotify
            }
        }));

        return albums;
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}


// Query the Spotify API for the tracks of a given album and return all the relevant data
async function fetchTracks(albumId) {

    if (!albumId) {
        throw 'Album id must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    try {
        let response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {headers : headers});
        let tracks = [];

        for (let track of response.data.items) {
            let artists = [];

            for (let artist of track.artists) {
                artists.push({
                    id : artist.id
                });
            }

            tracks.push({
                id : track.id,
                name : track.name,
                artists : artists,
                album : albumId,
                duration : track.duration_ms,
                explicit : track.explicit,
                number : track.track_number,
                url : track.external_urls.spotify
            })
        }

        return tracks;
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}
