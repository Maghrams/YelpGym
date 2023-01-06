const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Gym = require('./models/gym');
const { v4: uuidv4 } = require('uuid');

console.log(uuidv4())
//localhost:27017 doesn't work because it is not configured properly , so 127.0.0.1:27017 was used
mongoose.connect('mongodb://127.0.0.1:27017/YelpGym_Database',{
    //Default options with mongoDB connection
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected")
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.get('/',(req, res) =>{
    res.render('index');
})

//TODO delete test case
app.get('/newgym', async (req, res) =>{
    const gym = new Gym.Gym({
        gymUUID:uuidv4(),
        name:"Test Gym",
        addrress:{
            streetName:'Nassem',
            contactNumber:'+966546400149',
            location:['_21.52530477062381','_39.190138604320246'] //FIXME numbers dont appear in DB, check why .
        },
        reviews:[],
        owner:{
            name:'Faisal',
            phoneNumber:'+966536330154'
        }
    });
    await gym.save();
    res.send(gym);
})
app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})
