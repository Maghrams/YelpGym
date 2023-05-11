const express = require('express');//BAck-end framework, used to create server
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');//Replace Try/Catch with a function that overlaps all functions
const ReviewModel = require('../models/review');
const GymModel = require('../models/gym');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

//ROUTES
router.post('/',isLoggedIn ,validateReview, catchAsync(async (req, res)=>{
    const gym = await GymModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    review.author = req.user._id;
    gym.totalReview.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/gyms/${gym._id}`)
}))

router.delete('/:reviewId',isLoggedIn ,isReviewAuthor, catchAsync(async (req, res)=> {
    const {id, reviewId} = req.params;
    // how use mongoDB pull operator to remove from an array nested inside such as totalReviews.reviews show @Abdoh_Ardi later {{used You.com}}
    await GymModel.findByIdAndUpdate(id, { $pull: { "totalReviews.reviews": { reviewId: "review_id" } } });//Delete review from gym collection
    await ReviewModel.findByIdAndDelete(reviewId); //Delete review from reviews collection
    req.flash('success','Successfully deleted review!');
    res.redirect(`/gyms/${id}`);
}))

module.exports = router;