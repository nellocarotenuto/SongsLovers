// Module dependencies
const express = require('express');
const router = express.Router();

const artistsService = require('./tracks.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    res.send(await artistsService.getTrack(req.params.id));
});
