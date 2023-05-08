const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const gymSchema = new Schema({
    name: String,
    // TODO make working hours an array for ease od use
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
        reviews:[
            {
                type: Schema.Types.ObjectId,
                ref:'Review'
            }
        ]
    },
    owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    }
});

gymSchema.post('findOneAndRemove', async function (doc) {
    //mongoDB using post findOneAndDelete middleware to delete a nested review after deleting a gym such as doc.totalReview.reviews
    //{You.com}
    if (doc && doc.totalReview.reviews.length > 0) {
        // delete all the reviews of the deleted gym
        const reviewIds = doc.totalReview.reviews.map(review => review._id);
        await Review.deleteMany({ _id: { $in: reviewIds } });
    }
})

module.exports = mongoose.model('Gym', gymSchema);
