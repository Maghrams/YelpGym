const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GymSchema = new Schema({
    gymUUID: String,
    name: String,
    hours: String,
    image: String,
    email: String,
    website: String,
    facebook: String,
    twitter: String,
    instgram: String,
    address: {
        city: String,
        streetName: String,
        contactNumber: String,
        latitude: String,
        longitude: String
    },
    totalReview:{
        totalRating: Number,
        reviewsCount: Number,
        totalStars:[],
        review:[{
            userUUID: String,
            comment: String,
            rating: Number
        }]
    },
    owner: {
        name: String,
        phoneNumber: String,
    }
});

//TODO __ To Be Reported for problems found in our project if to put user id on url and make it scrap-able or abstract it with [...profile/me] method
const CredentialsSchema = new Schema({
    userUUID: String,
    credentials: [{
        email: String,
        password: String
    }]
});

const UserSchema = new Schema({
    userUUID: String,
    name: String,
    reviews: [{
        gymUUID: String,
        rating: Number,
        comment: String
    }]
});

const Gym = mongoose.model('gym', GymSchema);
const Credentials = mongoose.model('credentials', CredentialsSchema);
const User = mongoose.model('user', UserSchema);

module.exports = {Gym,Credentials,User};
