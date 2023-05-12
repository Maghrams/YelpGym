const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {storeReturnTo} = require("../middleware");
const userController = require("../controllers/users");

/*
1. Registration:
   - `GET /register`: Displays the registration form by calling the `renderRegister` method from the `userController`.
   - `POST /register`: Registers a new user by calling the `register` method from the `userController`. The route is wrapped in `catchAsync` to handle and propagate errors properly.
 */
router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register));

/*
2. Login:
   - `GET /login`: Displays the login form by calling the `renderLogin` method from the `userController`.
   - `POST /login`: Authenticates the user using Passport.js with the 'local' strategy. The `storeReturnTo` middleware stores the original requested URL before authentication. If authentication fails, a flash message is displayed and the user is redirected back to the login page. On successful authentication, the `login` method from the `userController` is called.
 */
router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash: true, failureRedirect: 'login'}), userController.login);

/*
3. Logout:
   - `GET /logout`: Logs out the user by calling the `logout` method from the `userController`.
 */
router.get('/logout', userController.logout);

/*
3. `module.exports = router;`: Exports the router object, making the defined routes available for use in other parts of the application.
 */
module.exports = router;