// Module dependencies
const express = require('express');
const router = express.Router();

const service = require('./albums.service');

// Export module functions
module.exports = router;

router.get('/:id', async function(req, res, next) {
    let album = await service.getAlbum(req.params.id);

    if (!album) {
        res.status(404).send(`Not found`);
    } else {
        res.send(album);
    }
});
