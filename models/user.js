const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/*
name: A string representing the user's name.

phoneNumber: A string representing the user's phone number.

email: A string representing the user's email address.
 This field is required and must be unique among all user documents.

reviews: An array of review objects associated with the user.
 Each review object has a gymID (String), body (String), and rating (Number).
 */
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

/*
The username and password fields are commented out in the schema because they will be added by the Passport plugin, passportLocalMongoose.
 The userSchema.plugin(passportLocalMongoose) line applies the plugin to the schema.
 This plugin simplifies the process of adding password hashing and user authentication to Mongoose models.
 */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);