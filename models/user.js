const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    //Added by Passport Plugin
    // username: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    phoneNumber: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    reviews: [{
        gymID: String,
        body: String,
        rating: Number
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);