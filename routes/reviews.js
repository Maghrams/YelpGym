const express = require('express');//BAck-end framework, used to create server
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');//Replace Try/Catch with a function that overlaps all functions
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");

//ROUTES

/*
1. `POST /`: Creates a new review by calling the `createReview` method from the `reviewController`. This route is protected by two middlewares: `isLoggedIn` and `validateReview`, which ensure the user is authenticated and the submitted review data is valid, respectively. The route is also wrapped in `catchAsync` to handle and propagate errors properly.
 */
router.post('/',isLoggedIn ,validateReview, catchAsync(reviewController.createReview))

/*
2. `DELETE /:reviewId`: Deletes a review with the specified `reviewId` by calling the `deleteReview` method from the `reviewController`. This route is protected by two middlewares: `isLoggedIn` and `isReviewAuthor`, which ensure the user is authenticated and the author of the review, respectively. The route is also wrapped in `catchAsync` to handle and propagate errors properly.

 */
router.delete('/:reviewId',isLoggedIn ,isReviewAuthor, catchAsync(reviewController.deleteReview))
/*

3. `module.exports = router;`: Exports the router object, making the defined routes available for use in other parts of the application.
 */
module.exports = router;

