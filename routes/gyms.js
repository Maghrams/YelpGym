const express = require("express");
const router = express.Router({mergeParams: true});
const gymController = require("../controllers/gyms");
const catchAsync = require("../utils/catchAsync"); //Replace Try/Catch with a function that overlaps all functions
const {isLoggedIn, validateGym, isOwner} = require("../middleware");
const {storage} = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage});

//ROUTES

//--------------------Index Gym Routes--------------------
/*
This code block defines a set of API routes for managing gym resources in an Express.js application at the root level of the resource. There are two HTTP methods supported:

1. `GET`: Fetches and displays a list of all gyms using the `index` method from the `gymController`.
2. `POST`: Creates a new gym using the `createGym` method from the `gymController`. This route is protected by two middlewares: `isLoggedIn` and `validateGym`, which ensure the user is authenticated and the submitted data is valid, respectively.

Both the controller methods are wrapped in `catchAsync` to handle and propagate errors properly.
 */
router.route('/')
    .get( catchAsync(gymController.index))
    .post( isLoggedIn,upload.array('image') ,validateGym , catchAsync(gymController.createGym)
);

//On GET /gyms/new di   rectory request => render new page
router.get("/new", isLoggedIn, gymController.renderNewForm);



//--------------------Show Gym Routes--------------------
/*
This code block defines a set of API routes for a gym resource in an Express.js application. The routes are based on the gym's `id` parameter. There are three HTTP methods supported:

1. `GET`: Fetches and displays the information of a gym with the specified `id` using the `showGym` method from the `gymController`.
2. `PUT`: Updates the information of a gym with the specified `id` using the `updateGym` method from the `gymController`. This route is protected by three middlewares: `isLoggedIn`, `isOwner`, and `validateGym`, which ensure the user is authenticated, the owner of the gym, and the submitted data is valid, respectively.
3. `DELETE`: Removes a gym with the specified `id` using the `deleteGym` method from the `gymController`. This route is protected by two middlewares: `isLoggedIn` and `isOwner`, which ensure the user is authenticated and the owner of the gym, respectively.

All controller methods are wrapped in `catchAsync` to handle and propagate errors properly.
 */
router.route('/:id')
    .get( catchAsync(gymController.showGym))
    .put( isLoggedIn, isOwner ,upload.array('image') ,validateGym , catchAsync(gymController.updateGym))
    .delete( isLoggedIn, isOwner, catchAsync(gymController.deleteGym));

//On GET /gyms/:id/edit directory request => render edit page
router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(gymController.renderEditForm));

/*
3. `module.exports = router;`: Exports the router object, making the defined routes available for use in other parts of the application.
 */
module.exports = router;
