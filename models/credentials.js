const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//TODO __ To Be Reported for problems found in our project if to put user id on url and make it scrap-able or abstract it with [...profile/me] method
const credentialsSchema = new Schema({
    credentials: [{
        email: String,
        password: String
    }]
});
