// Application dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./logger');

const homeRouter = require('../api/index');
const artistsRouter = require('../api/artists/artists.router');

const app = express();

// Configuration
app.use(morgan((tokens, req, res) => logger.formatMorganMessages(tokens, req, res)));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/artists', artistsRouter);

module.exports = app;
