const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: String,
    reviews: [{
        gymUUID: String,
        rating: Number,
        comment: String
    }]
});
