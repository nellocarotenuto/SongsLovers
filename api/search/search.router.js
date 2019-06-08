// Module dependencies
const express = require('express');
const router = express.Router();

const searchService = require('./search.service');

// Export module functions
module.exports = router;

router.get('/', async function(req, res, next) {
    res.send(await searchService.getResults(req.query.s));
});
