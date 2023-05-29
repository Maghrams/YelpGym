require('dotenv').config()
const mongoose = require('mongoose')
const GymModel = require('../models/gym');
const gymLeads = require("./gym_leads_plus.json")
const ReviewModel = require("../models/review");
const { v4: uuidv4 } = require('uuid');

/*
Connects to the MongoDB database using mongoose.connect with the connection string from the environment variable process.env.CONNECTION_STRING.
 The connection options include useNewUrlParser, useCreateIndex, useUnifiedTopology, and useFindAndModify.

Sets up event listeners for the Mongoose connection (db):

db.on("error", ...): Logs any connection errors to the console.
db.once("open", ...): Logs a message to the console when the database connection is established.
Deletes all existing documents from the GymModel and ReviewModel collections using deleteMany({}).

Iterates through the gymLeads.GymLeads array and creates new GymModel instances for each gym.
 The gym data is extracted from the gymLeads.GymLeads[i] object and used to populate the new gym document's properties.

Saves each new gym document to the GymModel collection using await gym.save().

When you run the seedDB function, it will connect to the MongoDB database,
 delete all existing gym and review documents,
  and populate the database with new gym documents based on the gym data from the gymLeads object.
 */
const seedDB = async() =>{

    await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }).then();

    const db =  await mongoose.connection;
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", () => {
        console.log("Database connected")
    })

    //Deletes Data from the DB then replaces it with new data
    await GymModel.deleteMany({})
    await ReviewModel.deleteMany({})

    for (let i = 0; i < gymLeads.GymLeads.length; i++){
        const gym = new GymModel({
            name: gymLeads.GymLeads[i].Name,
            hours: gymLeads.GymLeads[i].Hours,
            images: [
                {
                    url: gymLeads.GymLeads[i].Top_Image_URL,
                    filename:`YelpGym/${i}_${uuidv4()}`
                }
            ],
            email: gymLeads.GymLeads[i].Email,
            website: gymLeads.GymLeads[i].Website,
            facebook: gymLeads.GymLeads[i].Facebook,
            twitter: gymLeads.GymLeads[i].Twitter,
            instgram: gymLeads.GymLeads[i].Instagram,
            address: {
                city:gymLeads.GymLeads[i].City,
                streetName:gymLeads.GymLeads[i].Street_Address,
                contactNumber:gymLeads.GymLeads[i].Phone,
                latitude:gymLeads.GymLeads[i].Lat,
                longitude:gymLeads.GymLeads[i].Lng,
            },
            totalReview:{
                totalRating: gymLeads.GymLeads[i].Rating,
                reviewsCount: gymLeads.GymLeads[i].Reviews,
                totalStars:[
                    gymLeads.GymLeads[i].fiveStars,
                    gymLeads.GymLeads[i].fourStars,
                    gymLeads.GymLeads[i].threeStars,
                    gymLeads.GymLeads[i].twoStars,
                    gymLeads.GymLeads[i].oneStars
                ],
                reviews:[]
            },
            owner: '645330ce7446f22e380ff07c'
        })
        await gym.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
});