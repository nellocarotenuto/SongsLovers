// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const qs = require('qs');

// Authorization credentials
let CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
let SECRET_KEY = process.env.SPOTIFY_SECRET_KEY;

// Define the token object to return
let token;

// Compute the authorization code
let authCode = Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64');

// Define headers and request parameters
let headers = {
    'Content-Type' : 'application/x-www-form-urlencoded',
    'Authorization' : `Basic ${authCode}`
};

let data = {
    'grant_type' : 'client_credentials'
};

// Get a new token
async function refreshToken() {
    try {
        let response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), {headers : headers});

        let accessToken = response.data.access_token;
        let tokenType = response.data.token_type;
        let expiration  = Date.now() + response.data.expires_in * 1000;

        logger.silly(`Authenticated to Spotify with: ${tokenType} ${accessToken}`);

        return {accessToken, tokenType, expiration};
    } catch (err) {
        logger.error(`Error authenticating to Spotify API - ${err}`);
    }
}

// Export the authentication function
module.exports.getToken = async function() {
    // Generate a new token only if the one already obtained is already expired or it is about to expire
    if (!token || token.expiration <= (Date.now() - 1000)) {
        token = await refreshToken();
    } else {
        logger.silly(`Using previously authenticated token: ${token.tokenType} ${token.accessToken}`);
    }

    return token;
};
