const {gymValidationSchema, reviewValidationSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const GymModel = require("./models/gym");
const ReviewModel = require("./models/review");

/*
isLoggedIn: Checks if the user is authenticated by calling req.isAuthenticated(). If not,
 it stores the original URL in req.session.returnTo for redirecting the user back after login,
 sets a flash message,
 and redirects the user to the login page. If the user is authenticated,
 it calls the next() function to continue to the next middleware.
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

/*
storeReturnTo: Stores the return URL (req.session.returnTo) in res.locals.returnTo if it exists.
 This allows the return URL to be used in response templates.
 Calls next() to continue to the next middleware.
 */
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

/*
validateGym: Validates the request body against the gymValidationSchema using Joi. If there is an error,
 it constructs an error message and throws an ExpressError instance with the message and a 400 status code.
 If there are no errors,
 it calls next() to continue.
 */
module.exports.validateGym = (req, res, next) => {
    const {error} = gymValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/*
isOwner: Checks if the currently logged-in user is the owner of the gym with the specified id.
 If not, it sets a flash message and redirects the user to the gym's page.
 If the user is the owner, it calls next() to continue.
 */
module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id).populate("owner");
    if (!gym.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/gyms/${id}`);
    }
    next();
}

/*
validateReview: Validates the request body against the reviewValidationSchema using Joi. If there is an error,
 it constructs an error message and throws an ExpressError instance with the message and a 400 status code.
 If there are no errors, it calls next() to continue.
 */
module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewValidationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{next();}
}

/*
isReviewAuthor: Checks if the currently logged-in user is the author of the review with the specified reviewId.
 If not, it sets a flash message and redirects the user to the gym's page.
 If the user is the author, it calls next() to continue.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await ReviewModel.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/gyms/${id}`);
    }
    next();
}

/*
These middleware functions can be used in your Express routes to add authentication, authorization,
 and validation checks to your application.
 To use these middleware functions,
 simply import them into your route files and add them to your route definitions as needed
 */

