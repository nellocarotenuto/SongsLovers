/**
  * Database dependencies.
 */

const mongoose = require('mongoose');
const chalk = require('chalk');

/**
 * Database connection properties
 */

const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'songslovers';

/**
 * Define console preferences.
 */

let connected = chalk.bold.cyan;
let error = chalk.bold.yellow;
let disconnected = chalk.bold.red;
let termination = chalk.bold.magenta;

/**
 * Export mongoose and connect function.
 */

module.exports.mongoose = mongoose;
module.exports.connect = () => {
    let dbUrl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
    mongoose.connect(dbUrl, {useNewUrlParser : true});

    mongoose.connection.on('connected', function(){
        console.log(connected(`Opened connection to MongoDB at ${dbUrl}`));
    });

    mongoose.connection.on('error', function(err){
        console.log(error(`Unable to open connection to MongoDB: ${err}`));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected(`Closed connection to MongoDB`));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination(`Closed connection to MongoDB due to application termination`));
            process.exit(0)
        });
    });
};