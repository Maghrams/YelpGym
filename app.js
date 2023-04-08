require('dotenv').config()
const express = require('express'); //BAck-end framework, used to create server
const path = require('path');
const mongoose = require('mongoose'); //MongoDB connection, schema and model (ORM Approach), and query builder
const ejsMate =  require('ejs-mate') // Template engine for ejs,
const GymModel = require('./models/gym');
const methodOverride = require('method-override');//Method override function to fix the problem of not being able to use PUT and DELETE methods
const morgan = require('morgan');//DEV info to check API requests
const catchAsync = require('./utils/catchAsync');//Replace Try/Catch with a fucntion that overlaps all functions
const ExpressError = require('./utils/ExpressError');//Extend Error class with message & status_code functions
const {gymSchema} = require('./schemas.js');//Validation framework to validate try of inputs

//FIXME localhost:27017 doesn't work because it is not configured properly , so 127.0.0.1:27017 was used
//Initialize Connection to MongoDB with parameters

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//Connect to DB
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected")
})

//Initialize express app
const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use('/favicon.ico', express.static('resources/favicon.ico'));

//MIDDLEWARES
//Validation middleware, to validate gym inputs
const validateGym = (req, res, next) =>{

    const {error} = gymSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);

    }else{next();}
}

//On GET root directory request => render home page
app.get('/',(req, res) =>{
    res.render('home');
})
//On GET gyms directory request => render gyms page
app.get('/gyms', catchAsync(async (req, res) =>{
    //Query all gyms from Database and save them to allGyms
    const allGyms = await GymModel.Gym.find({});
    //Render all gyms page and send allGYms list for EJS engine
    res.render('gyms/index',{allGyms});
}))

// Add new GYm function, consist of two operations, GET and POST
//------------------------------------------------
//On GET /gyms/new directory request => render new page
app.get('/gyms/new', (req, res) =>{
    res.render('gyms/new');
})

/*On POST request via new gym form , First: Validate inputs using validateGym(),
Catch Errors using catchAsync,
After that, start creating new gym object using GymModel.Gym() and save it to DB,
Then redirect to the new gym page
*/
app.post('/gyms', validateGym,catchAsync(async (req, res) =>{
    const gym = new GymModel.Gym(req.body.gym);
    await gym.save()
    res.redirect(`/gyms/${gym._id}`)
}))
//------------------------------------------------


///On GET request for directory /gym/:ID parse ID and look up in DB for ID,
//Then retrieve Gym data and display gym with data
app.get('/gyms/:id',catchAsync(async (req, res) =>{

    const gym = await GymModel.Gym.findById(req.params.id);
    res.render('gyms/show',{gym});
}))
//--------------------------------


//Edit gym page, consist of two operations ,GET and PUT
//On GET /gyms/:ID/edit request ,
//Retrieve gym data by ID from DB,
//Then display Edit page
app.get("/gyms/:id/edit", catchAsync(async (req, res)=>{
    const gym = await GymModel.Gym.findById(req.params.id);
    res.render('gyms/edit',{gym});
}))

//On submitting Edit form
//First Validate data using validateGYm(),
//Then take ID and update gym on DB with gym data
//Lastly redirect to show gym page
app.put("/gyms/:id",validateGym, catchAsync(async (req, res)=>{
    const {id} = req.params;
    const gym = await GymModel.Gym.findByIdAndUpdate(id, {...req.body.gym});
    res.redirect(`/gyms/${gym._id}`)
}))
//--------------------------------------

//On clicking Delete button from SHow gym page
//fetch gym ID and look it up in DB then Delete gym
//THen redirect to All gyms (index) page
app.delete("/gyms/:id", catchAsync(async (req, res)=>{
    const {id} = req.params;
    await GymModel.Gym.findByIdAndRemove(id);
    res.redirect("/gyms");

}))

//TODO Apply page not found for non-extisting gym IDs and { /gyms/* } pages
//If Page doesnt exist, render not_found page and send 404 status code
app.all('*',(req, res,next)=>{
    res.status(404).render("not_found")
})

//Error Middleware if any error occur from catchAsync function send it here,
//It's either a predefined error that has a predefined error message and status code
//Otherwise for non-defined errors give them status code 500 and message code ,
// render the error on error page
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("error",{err});
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})

