// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const SearchResults = new Schema({
    query : {type : String, required : true},
    artists : [{
        name : {type : String, required : true},
        id : {type : String, required : true},
        picture : String
    }],
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('SearchResults', SearchResults);
