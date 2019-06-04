// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Artist = new Schema({
    name : {type : String, required : true},
    picture : String,
    bio : String,
    genres : [String],
    spotifyId : {type : String, required : true},
    twitter : String,
    facebook : String,
    instagram : String,
    wikipedia : String,
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('Artist', Artist);
