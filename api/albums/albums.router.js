// Module dependencies
const express = require('express');
const router = express.Router();

const service = require('./albums.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    res.send(await service.getAlbum(req.params.id));
});
