const User = require('../models/user');

/*
renderRegister:

Renders the 'users/register' view.
 */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

/*
register:

It destructures email, username, and password from req.body.
It creates a new User instance with email and username.
It registers the user with User.register() and hashes the password.
It logs in the registered user with req.login().
If there's an error, it calls the next() function with the error.
It flashes a "success" message and redirects to the '/gyms' route.
If there's an exception, it flashes an "error" message and redirects to the '/register' route.
 */
module.exports.register = async (req, res, next)=>{
    try {
        const {email, username, password} = req.body;
        const user = await new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success','Welcome to YelpGym');
            res.redirect('/gyms');
        }) //Log in user after registration
    }catch (e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
};

/*
renderLogin:

Renders the 'users/login' view.
 */
module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
};

/*
login:

It flashes a "success" message.
It checks for a stored return URL in res.locals.returnTo and sets a fallback to '/gyms'.
It deletes the returnTo property from the req.session object.
It redirects to the stored or fallback URL.
 */
module.exports.login =(req, res)=>{
    req.flash('success', "Welcome back!");
    const redirectUrl = res.locals.returnTo || '/gyms';
    delete  req.session.returnTo;
    res.redirect(redirectUrl);
};

/*
logout:

It logs out the user with req.logout().
If there's an error, it calls the next() function with the error.
It flashes a "success" message and redirects to the '/gyms' route.
 */
module.exports.logout =  (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/gyms');
    });
};