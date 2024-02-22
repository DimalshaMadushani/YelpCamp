const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
//to ovveride the patch , delete requests
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds')


//connect to databse
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo Database connected !!")
    })
    .catch(err => {
        console.log("Mongo Database connection error !!!")
        console.log(err)
    })

//to ovveride the patch , delete requests
// const methodOverride = require('method-override');
//middleware
//this is for parsing the body of the request
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json())// for parsing application/json
//_method is the name of the query string
app.use(methodOverride('_method'))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/',(req,res) => {
    // res.send("Helloo!")
    res.render('home')
})

// show all the campgrounds
app.get('/campgrounds',async (req,res) => {
   const campgrounds = await Campground.find({})
   res.render('campgrounds/index',{campgrounds})
})

//adding a new campground
app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds',async (req,res) => {
    const {title,location} = req.body
    const campground = await Campground.create({title,location})
    // await Campground.create(req.body.campground)
   res.redirect(`/campgrounds/${campground.id}`)
})

// show one campground details 
app.get('/campgrounds/:id' , async(req,res) => {
    const {id} = req.params
    // console.log(id)
    const campground = await Campground.findById(id)
    res.render('campgrounds/show',{campground})
})

//edit campground details 
app.get('/campgrounds/:id/edit',async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
})

app.patch('/campgrounds/:id',async (req,res) => {
    const {id} = req.params;
    const {title,location} = req.body
    await Campground.findByIdAndUpdate(id,{title:title,location:location})
    res.redirect('/campgrounds')
})

//delete a campground 
app.delete('/campgrounds/:id',async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})
// app.get('/makecampground',async (req,res) => {
//     const camp = await Campground.create({title:'My Backyard',description:'Cheap Camping'})
//     res.send(camp)
// })
app.listen(3000, () => {
    console.log("Listening on port 3000..")
})