
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
//connect to databse
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo Database connected !!")
    })
    .catch(err => {
        console.log("Mongo Database connection error !!!")
        console.log(err)
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

//removing everthing in the database
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i< 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = await Campground.create({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`

        })
    }
   
}

seedDB().then(() => {
    mongoose.connection.close()
}) 