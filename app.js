const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const GymModel = require('./models/gym');
const methodOverride = require('method-override');

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

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.get('/',(req, res) =>{
    res.render('index');
})
app.get('/',(req, res) =>{
    res.render('index');
})

app.get('/gyms', async (req, res) =>{
    const allGyms = await GymModel.Gym.find({});
    res.render('gyms/index',{allGyms});
})

app.get('/gyms/new', (req, res) =>{
    res.render('gyms/new');
})

app.post('/gyms',async (req, res) =>{
    const gym = new GymModel.Gym(req.body.gym);
    await gym.save()
    res.redirect(`/gyms/${gym._id}`)
})
app.get('/gyms/:id',async (req, res) =>{
    //using UUID package to identify gyms and users neglecting MongoDB's ID system intentionally
    const gym = await GymModel.Gym.findById(req.params.id);
    res.render('gyms/show',{gym});
})

app.get("/gyms/:id/edit", async (req, res)=>{
    const gym = await GymModel.Gym.findById(req.params.id);
    res.render('gyms/edit',{gym});
})

app.put("/gyms/:id", async (req, res)=>{
    const {id} = req.params;
    const gym = await GymModel.Gym.findByIdAndUpdate(id, {...req.body.gym});
    res.redirect(`/gyms/${gym._id}`)
})

app.delete("/gyms/:id", async (req, res)=>{
    const {id} = req.params;
    await GymModel.Gym.findByIdAndRemove(id);
    res.redirect("/gyms");
})
app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})
