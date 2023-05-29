const GymModel = require("../models/gym");
const ReviewModel = require("../models/review");

/*
createReview:

It finds a gym document in the GymModel collection by its ID (req.params.id).
It creates a new ReviewModel instance with the data from req.body.review.
It sets the review author's _id property to req.user._id.
It pushes the new review to the gym's totalReview.reviews array.
It saves the new review and the gym document.
It flashes a "success" message and redirects to the gym's detail page.
 */
module.exports.createReview = async (req, res)=>{
    const gym = await GymModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    review.author = req.user._id;
    gym.totalReview.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/gyms/${gym._id}`)
};

/*
deleteReview:

It destructures the id and reviewId from req.params.
It updates the gym document by its ID (id) and removes the review from the totalReviews.reviews array using the $pull operator in MongoDB. (Note: There is a typo in the $pull query, please see the corrected version below.)
It removes the review document from the ReviewModel collection by its ID (reviewId).
It flashes a "success" message and redirects to the gym's detail page.
 */
module.exports.deleteReview = async (req, res)=> {
    const {id, reviewId} = req.params;
    // how use mongoDB pull operator to remove from an array nested inside such as totalReviews.reviews show @Abdoh_Ardi later {{used You.com}}
    await GymModel.findByIdAndUpdate(id, { $pull: { "totalReviews.reviews": { reviewId: "review_id" } } });//Delete review from gym collection
    await ReviewModel.findByIdAndDelete(reviewId); //Delete review from reviews collection
    req.flash('success','Successfully deleted review!');
    res.redirect(`/gyms/${id}`);
}