const express = require('express');//BAck-end framework, used to create server
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');//Replace Try/Catch with a function that overlaps all functions
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");

//ROUTES
router.post('/',isLoggedIn ,validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId',isLoggedIn ,isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;