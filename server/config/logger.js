// Module dependencies
const winston = require('winston');

// Extract variables to improve reading
const format = winston.format;
const transports = winston.transports;

// Define the logging level
const level = process.env.LOGGER_LEVEL;

// Define the desired output format
const consoleFormat = format.combine(
    format(info => {
        info.level = info.level.toUpperCase()
        return info;
    })(),
    winston.format.colorize({
        all : true
    }),
    format.timestamp({
        format : 'DD/MM/YYYY HH:mm:ss'
    }),
    format.printf(info => `[${info.timestamp}] - [${info.level}] ${info.message}`)
);

// Build the logger
const logger = new winston.createLogger({
    level : level,
    format : consoleFormat,
    transports : new transports.Console(),
    exitOnError : false
});

// Define a function to log Morgan messages
logger.formatMorganMessages = (tokens, req, res) => {
    let status = tokens.status(req, res);

    let message = `${tokens.method(req, res)} ${tokens.url(req, res)} - HTTP/${tokens['http-version'](req, res)} ${status} - ${tokens['response-time'](req, res)}ms - ${tokens['user-agent'](req, res)}`;

    if (status >= 500) {
        logger.error(message);
    } else if (status >= 400) {
        logger.warn(message);
    } else if (status >= 200) {
        logger.info(message);
    } else {
        logger.verbose(message);
    }
}

module.exports = logger;