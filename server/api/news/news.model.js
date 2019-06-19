// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const News = new Schema({
    artist : {
        id : {type : String, required : true},
        name : {type : String, required : true},
    },
    news : [{
        title: {type: String, required: true},
        excerpt: String,
        date: Date,
        picture: String,
        link: String,
        source: {type: String, required: true},
    }],
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('News', News);
