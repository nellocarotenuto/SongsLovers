// Module dependencies
const express = require('express');
const router = express.Router();

const artistsService = require('./artists.service');
const albumsService = require('../albums/albums.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    res.send(await artistsService.getArtist(req.params.id));
});

router.get('/:id/albums', async function(req, res, next) {
    res.send(await albumsService.getArtistAlbums(req.params.id));
});
