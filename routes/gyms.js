const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');//Replace Try/Catch with a function that overlaps all functions
const ExpressError = require('../utils/ExpressError');//Extend Error class with message & status_code functions
const {gymValidationSchema} = require('../schemas.js');//Validation framework to validate try of inputs
const GymModel = require('../models/gym');
const {isLoggedIn} = require('../middleware');

//MIDDLEWARES
//Validation middleware, to validate gym inputs
const validateGym = (req, res, next) =>{
    const {error} = gymValidationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);

    }else{next();}
}
//ROUTES

//On GET gyms directory request => render gyms page
router.get('/', catchAsync(async (req, res) =>{
    //Query all gyms from Database and save them to allGyms
    const allGyms = await GymModel.find({});
    //Render all gyms page and send allGYms list for EJS engine
    res.render('gyms/index',{allGyms});
}))

// Add new GYm function, consist of two operations, GET and POST
//------------------------------------------------
//On GET /gyms/new directory request => render new page
router.get('/new' ,isLoggedIn, (req, res) =>{
    res.render('gyms/new');
})

/*On POST request via new gym form , First: Validate inputs using validateGym(),
Catch Errors using catchAsync,
After that, start creating new gym object using GymModel and save it to DB,
Then redirect to the new gym page
*/

router.post('/',isLoggedIn , validateGym, catchAsync(async (req, res) =>{
    const gym = new GymModel(req.body.gym);
    gym.owner = req.user._id; //Set owner of gym to the current user
    await gym.save()
    req.flash('success','Succ essfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`)
}))
//------------------------------------------------


///On GET request for directory /gym/:ID parse ID and look up in DB for ID,
//Then retrieve Gym data and display gym with data
//TODO make sure that user is logged in before submitting a review not before showing gym page
router.get('/:id',catchAsync(async (req, res) =>{
    const gym = await GymModel.findById(req.params.id)
        .populate('totalReview.reviews')
        .populate('owner');
    if(!gym){
        req.flash('error','Cannot find that gym!');
        return res.redirect('/gyms');
    }
    res.render('gyms/show',{gym});
}))
//--------------------------------


//Edit gym page, consist of two operations ,GET and PUT
//On GET /gyms/:ID/edit request ,
//Retrieve gym data by ID from DB,
//Then display Edit page
//TODO make sure that only owner can edit a gym page
router.get("/:id/edit",isLoggedIn , catchAsync(async (req, res)=>{
    const gym = await GymModel.findById(req.params.id);
    if(!gym){
        req.flash('error','Cannot find that gym!');
        return res.redirect('/gyms');
    }
    res.render('gyms/edit',{gym});
}))

//On submitting Edit form
//First Validate data using validateGYm(),
//Then take ID and update gym on DB with gym data
//Lastly redirect to show gym page
router.put("/:id",isLoggedIn ,validateGym, catchAsync(async (req, res)=>{
    const {id} = req.params;
    const gym = await GymModel.findByIdAndUpdate(id, {...req.body.gym});
    req.flash('success','Successfully updated gym!');
    res.redirect(`/gyms/${gym._id}`)
}))
//--------------------------------------

//On clicking Delete button from SHow gym page
//fetch gym ID and look it up in DB then Delete gym
//THen redirect to All gyms (index) page
router.delete("/:id",isLoggedIn , catchAsync(async (req, res)=>{
    const {id} = req.params;
    await GymModel.findByIdAndRemove(id);
    req.flash('success','Successfully deleted gym!');
    res.redirect("/gyms");
}))

module.exports = router;