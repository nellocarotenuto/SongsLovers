// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');

const spotify = require('./spotify.auth');

// Export module functions
module.exports.searchArtists = searchArtists;
module.exports.fetchArtist = fetchArtist;
module.exports.fetchAlbums = fetchAlbums;
module.exports.fetchAlbum = fetchAlbum;
module.exports.fetchTracks = fetchTracks;
module.exports.fetchTrack = fetchTrack;


// Return request headers
async function getAuthHeaders() {

    // Authorize requests
    let {accessToken, tokenType} = await spotify.getToken();

    // Define authorization headers
    return {
        'Authorization' : `${tokenType} ${accessToken}`
    };
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
                id : item.id,
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

        return {
            id: response.data.id,
            name: response.data.name,
            genres: response.data.genres,
            picture: response.data.images[0] ? response.data.images[0].url : undefined
        };
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

    let params = {
        country : "IT"
    };

    try {
        let response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {headers : headers, params : params});

        return await Promise.all(response.data.items.map(async (item) => {
            let albumId = item.id;

            let response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {headers: headers});
            let artists = [];

            for (let artist of response.data.artists) {
                artists.push({
                    id : artist.id,
                    name : artist.name
                });
            }

            return {
                id: response.data.id,
                name: response.data.name,
                artists: artists,
                type: response.data.album_type,
                cover: response.data.images[0] ? response.data.images[0].url : undefined,
                date: new Date(Date.parse(response.data.release_date)),
                url: response.data.external_urls.spotify
            }
        }));
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}


// Query the Spotify API for the album of a given id and return all the relevant data
async function fetchAlbum(albumId) {
    if (!albumId) {
        throw 'Album ID must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    try {
        let response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {headers : headers});

        let artists = [];

        for (let artist of response.data.artists) {
            artists.push({
                id : artist.id,
                name : artist.name
            });
        }

        let tracks = [];

        for (let track of response.data.tracks.items) {
            let artists = [];

            for (let artist of track.artists) {
                artists.push({
                    id : artist.id,
                    name : artist.name
                });
            }

            tracks.push({
                id : track.id,
                name : track.name,
                artists : artists,
                duration : track.duration_ms,
                explicit : track.explicit,
                number : track.track_number,
                spotify : track.external_urls.spotify
            });
        }

        return {
            id: response.data.id,
            name: response.data.name,
            genres: response.data.genres,
            cover: response.data.images[0] ? response.data.images[0].url : undefined,
            type : response.data.type,
            date : new Date(Date.parse(response.data.release_date)),
            tracks : tracks,
            artists : artists,
            spotify : response.data.external_urls.spotify
        }
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }
}


// Query the Spotify API for the tracks of a given album and return their IDs
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
            tracks.push({
                id : track.id,
                name : track.name,
                artists : track.artists,
                duration : track.duration_ms,
                explicit : track.explicit
            });
        }

        return tracks;
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}

// Query the Spotify API for the track of a given id and return all the relevant data
async function fetchTrack(trackId) {

    if (!trackId) {
        throw 'Track id must be defined';
    }

    // Get authorization headers
    let headers = await getAuthHeaders();

    try {
        let response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {headers : headers});

        let artists = [];

        for (let artist of response.data.artists) {
            artists.push({
                id : artist.id,
                name : artist.name
            });
        }

        let albumArtists = [];

        for (let artist of response.data.album.artists) {
            albumArtists.push({
                id : artist.id,
                name : artist.name
            })
        }

        let album = {
            id : response.data.album.id,
            name : response.data.album.name,
            cover : response.data.album.images[0] ? response.data.album.images[0].url : undefined,
            type : response.data.album.album_type,
            artists : albumArtists,
            spotify : response.data.album.external_urls.spotify
        };

        return {
            id : response.data.id,
            name : response.data.name,
            artists : artists,
            album : album,
            duration : response.data.duration_ms,
            explicit : response.data.explicit,
            number : response.data.track_number,
            url : response.data.external_urls.spotify
        }
    } catch (err) {
        logger.error(`Error occurred querying Spotify API - ${err}`);
    }

}
