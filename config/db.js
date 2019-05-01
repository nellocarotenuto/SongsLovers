// Database dependencies
const mongoose = require('mongoose');
const logger = require('./logger');

// Database connection properties
const MONGO_HOSTNAME = process.env.DB_HOST;
const MONGO_PORT = process.env.DB_PORT;
const MONGO_DB = process.env.DB_NAME;

// Export mongoose and connect function
module.exports.connect = () => {
    let dbUrl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
    mongoose.connect(dbUrl, {useNewUrlParser : true});

    mongoose.connection.on('connected', () => {
        logger.info(`Opened connection to MongoDB at ${dbUrl}`);
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`Unable to open connection to MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn(`Closed connection to MongoDB`);
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            logger.warn(`Closed connection to MongoDB due to application termination`);
            process.exit(0)
        });
    });
};