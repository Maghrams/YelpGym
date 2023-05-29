const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

/*
ImageSchema: A schema for image documents with two properties, url and filename.
 */
const ImageSchema = new Schema ({
    url: String,
    filename: String
});

/*
ImageSchema.virtual('thumbnail'): A virtual property called 'thumbnail' that returns a modified image URL
for creating thumbnails by replacing /upload with /upload/w_200 in the image URL.
 */
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

/*
gymSchema: A schema for gym documents with the following properties:
name: A string representing the gym's name.
hours: A string representing the gym's working hours.
images: An array of ImageSchema documents.
email, website, facebook, twitter, instgram: Strings representing contact information and social media links.
address: An object containing the gym's address information (city, streetName, contactNumber, latitude, and longitude).
totalReview: An object containing the gym's rating and reviews information (totalRating, reviewsCount, totalStars, and an array of review references).
owner: A reference to the gym's owner in the 'User' collection.
 */
const gymSchema = new Schema({
    name: String,
    // TODO make working hours an array for ease od use
    hours: String,
    images: [ImageSchema],
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

/*
gymSchema.post('findOneAndRemove'): A Mongoose middleware function that runs after a gym document is removed using the 'findOneAndRemove' method.
 This middleware deletes all the reviews associated with the removed gym.
 If the gym has any reviews, it maps their _ids and then deletes them from the 'Review' collection using the $in query operator.
 */
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
