const express = require("express");
const router = express.Router({mergeParams: true});
const gymController = require("../controllers/gyms");
const catchAsync = require("../utils/catchAsync"); //Replace Try/Catch with a function that overlaps all functions
const GymModel = require("../models/gym");
const {isLoggedIn, validateGym, isOwner} = require("../middleware");
const User = require("../models/user");

//ROUTES

//On GET gyms directory request => render gyms page
router.get("/", catchAsync(gymController.index));

// Add new GYm function, consist of two operations, GET and POST
//------------------------------------------------
//On GET /gyms/new directory request => render new page
router.get("/new", isLoggedIn, gymController.renderNewForm);

/*On POST request via new gym form , First: Validate inputs using validateGym(),
Catch Errors using catchAsync,
After that, start creating new gym object using GymModel and save it to DB,
Then redirect to the new gym page
*/

router.post("/", isLoggedIn, validateGym, catchAsync(gymController.createGym)
);

//------------------------------------------------

///On GET request for directory /gym/:ID parse ID and look up in DB for ID,
//Then retrieve Gym data and display gym with data
//TODO make sure that user is logged in before submitting a review not before showing gym page
router.get("/:id", catchAsync(gymController.showGym));
//--------------------------------

//Edit gym page, consist of two operations ,GET and PUT
//On GET /gyms/:ID/edit request ,
//Retrieve gym data by ID from DB,
//Then display Edit page
//TODO make sure that only owner can edit a gym page
router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(gymController.renderEditForm));

//On submitting Edit form
//First Validate data using validateGYm(),
//Then take ID and update gym on DB with gym data
//Lastly redirect to show gym page
router.put("/:id", isLoggedIn, validateGym, isOwner, catchAsync(gymController.updateGym));
//--------------------------------------

//On clicking Delete button from SHow gym page
//fetch gym ID and look it up in DB then Delete gym
//THen redirect to All gyms (index) page
router.delete("/:id", isLoggedIn, isOwner, catchAsync(gymController.deleteGym));

module.exports = router;
