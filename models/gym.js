const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GymSchema = new Schema({
    gymUUID: String,
    name: String,
    address: {
        streetName: String,
        contactNumber: String,
        location: [String, String]/*[latitude, longitude]*/,
    },
    reviews:[{
        rating: Number,
        userUUID: String,
        comment: String
    }],
    owner: {
        name: String,
        phoneNumber: String,
    }
});

//FIXME __ To Be Reported for problems found in our project
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

// TODO __ check If better to make it seperate files with many exports or one big export
module.exports = mongoose.model('YelpGym', {
    GymSchema: GymSchema,
    CredentialsSchema: CredentialsSchema,
    UserSchema: UserSchema
});

/* Examble ---------
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
 */