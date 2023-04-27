require('dotenv').config()
const express = require('express'); //Back-end framework, used to create server
const path = require('path');//Path module to get the path of the current directory, make it works with different OSes
const mongoose = require('mongoose'); //sMongoDB connections, schema and model (ORM Approach), and query builder
const ejsMate =  require('ejs-mate') // Template engine for ejs,
const methodOverride = require('method-override');//Method override function to fix the problem of not being able to use PUT and DELETE methods
const morgan = require('morgan');//DEV info to check API requests
const session = require('express-session');//Session middleware to store user data
const flash = require('connect-flash');//Flash middleware to send messages to the user
const passport = require('passport');//Passport middleware to authenticate users
const LocalStrategy = require('passport-local');//Local Strategy to authenticate users with username and password
const User = require('./models/user');//Import User model

//Import Routes
const gymRoutes = require('./routes/gyms');//Import gym routes
const reviewRoutes = require('./routes/reviews');//Import review routes
const userRoutes = require('./routes/users');//Import user routes

//Initialize Connection to MongoDB with parameters
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then();

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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//These two methods are provided by passport-local-mongoose for session storing and destroying
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Custom Middleware to send flash messages to the user
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/gyms',gymRoutes);
app.use('/gyms/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

//On GET root directory request => render home page
app.get('/',(req, res) =>{
    res.render('home');
})

//TODO Apply page not found for non-existing gym IDs and { /gyms/* } pages
//If Page doesnt exist, render not_found page and send 404 status code

app.all('*',(req, res,next)=>{
    res.status(404).render("not_found")
})

//Error Middleware if any error occur from catchAsync function send it here,
//It's either a predefined error that has a predefined error message and status code
//Otherwise for non-defined errors give them status code 500 and a generic message code ,
// render the error on error page
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("error",{err});
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})


