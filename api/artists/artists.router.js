// Module dependencies
const express = require('express');
const router = express.Router();

const artistsService = require('./artists.service');
const albumsService = require('../albums/albums.service');
const newsService = require('../news/news.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    let artist = await artistsService.getArtist(req.params.id);

    if (!artist) {
        res.status(404).send(`Not found`);
    } else {
        res.send(artist);
    }
});

router.get('/:id/albums', async function(req, res, next) {
    let albums = await albumsService.getArtistAlbums(req.params.id);

    if (!albums) {
        res.status(404).send(`Not found`);
    } else {
        res.send(albums);
    }
});

router.get('/:id/news', async function(req, res, next) {
    res.send(await newsService.getNews(req.params.id));
});