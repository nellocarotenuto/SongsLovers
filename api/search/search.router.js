// Module dependencies
const express = require('express');
const router = express.Router();

const searchService = require('./search.service');

// Export module functions
module.exports = router;

router.get('/', async function(req, res, next) {
    let query = req.query.s;

    if (!query) {
        res.status(400).send(`Bad request`);
    } else {
        res.send(await searchService.getResults(query));
    }
});
