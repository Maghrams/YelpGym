const {gymValidationSchema, reviewValidationSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const GymModel = require("./models/gym");
const ReviewModel = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateGym = (req, res, next) => {
    const {error} = gymValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id).populate("owner");
    if (!gym.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/gyms/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewValidationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{next();}
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await ReviewModel.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/gyms/${id}`);
    }
    next();
}

