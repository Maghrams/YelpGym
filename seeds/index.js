require('dotenv').config({path : '../.env'})
const mongoose = require('mongoose')
const GymModel = require('../models/gym');
const gymLeads = require("./gym_leads_plus.json")
const ReviewModel = require("../models/review");

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected")
})

const seedDB = async() =>{
    //Deletes Data from the DB then replaces it with new data
    await GymModel.deleteMany({})
    await ReviewModel.deleteMany({})

    for (let i = 0; i < gymLeads.GymLeads.length; i++){
        const gym = new GymModel({
            name: gymLeads.GymLeads[i].Name,
            hours: gymLeads.GymLeads[i].Hours,
            image: gymLeads.GymLeads[i].Top_Image_URL,
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