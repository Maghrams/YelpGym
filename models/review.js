const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
body: A string representing the content of the review.
rating: A number representing the rating given to the gym by the reviewer. This is typically on a scale (e.g., 1 to 5 stars).
author: A reference to the author of the review in the 'User' collection. This is represented by a MongoDB ObjectId (Schema.Types.ObjectId) and the ref attribute is set to 'User'. This sets up a relationship between the 'Review' and 'User' collections for easy population when querying reviews with their authors.
This schema can be used to create a Mongoose model for storing and managing review documents in a MongoDB collection.
 */
const reviewSchema = new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);