// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Album = new Schema({
    id : {type : String, required : true},
    name : {type : String, required : true},
    cover : String,
    type : {type : String, required : true},
    genres : [String],
    date : {type : Date, required : true},
    artists : [{
        id : {type : String, required : true},
        name : {type : String, required : true}
    }],
    tracks : [{
        id : {type : String, required : true},
        name : {type : String, required : true},
        artists : [{
            id : {type : String, required : true},
            name : {type : String, required : true}
        }],
        duration : {type : Number, required : true},
        explicit : {type : Boolean, default : false},
        number : {type : Number, required : true},
        spotify : {type : String, required : true},
    }],
    spotify : {type : String, required : true},
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('Album', Album);
