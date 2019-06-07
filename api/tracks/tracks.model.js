// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Track = new Schema({
    id : {type : String, required : true},
    name : {type : String, required : true},
    artists : [{
        id : {type : String, required : true},
        name : {type : String, required : true}
    }],
    album : {
        id : {type : String, required : true},
        name : {type : String, required : true},
        cover : String,
        type : {type : String, required : true},
        artists : [{
            id : {type : String, required : true},
            name : {type : String, required : true}
        }],
        spotify : {type : String, required : true}
    },
    duration : {type : Number, required : true},
    explicit : {type : Boolean, default : false},
    number : {type : Number, required : true},
    spotify : {type : String, required : true},
    lyrics : String,
    video : String,
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('Track', Track);
