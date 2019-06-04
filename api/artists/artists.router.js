// Module dependencies
const express = require('express');
const router = express.Router();

const service = require('./artists.service');

// Export module functions
module.exports = router;

router.get('/:spotifyId', async function(req, res, next) {
    res.send(await service.getArtist(req.params.spotifyId));
});
