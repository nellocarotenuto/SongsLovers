// Module dependencies
const express = require('express');
const router = express.Router();

const artistsService = require('./tracks.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    let track = await artistsService.getTrack(req.params.id);

    if (!track) {
        res.status(404).send(`Not found`);
    } else {
        res.send(track);
    }
});
