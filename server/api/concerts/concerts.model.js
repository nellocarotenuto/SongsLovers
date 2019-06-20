// Module dependencies
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Concert = new Schema({
    artist : {
        id : {type : String, required : true},
        name : {type : String, required : true},
    },
    concerts : [{
        date : {type : Date, required : true},
        place : {type : String, required : true},
        tickets : [{
            seller : {type : String, required : true},
            link : String,
            price : Number
        }]
    }],
    updated : {type : Date, default : Date.now}
});

// Export the model class
module.exports = mongoose.model('Concert', Concert);
