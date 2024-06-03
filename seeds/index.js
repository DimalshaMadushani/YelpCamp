const mongoose = require('mongoose');
const cities = require('./cities');
// const axios = require('axios');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery & monitoring engine
    useFindAndModify: false // Use `findOneAndUpdate()` and `findOneAndDelete()` without the `findAndModify` functionality
})
.then(() => {
    console.log("Mongo Database connected !!")
})
.catch(err => {
    console.log("Mongo Database connection error !!!")
    console.log(err)
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// const getRandomImage = async () => {
//     try {
//         const response = await axios.get('https://api.unsplash.com/photos/random', {
//             params: {
//                 client_id: 'PSrBaQYPCln4kqrTpE3pABs-XKOG8u9K9zNtLs10lns', // Replace with your Unsplash access key
//                 // You can add more parameters here to customize the returned images
//                 collections:'483251,DSpWkevZa94'
//             }
//         });
//         return response.data.urls.regular; // or whichever image size you prefer
//     } catch (error) {
//         console.error("Error fetching image from Unsplash:", error);
//     }
// };

//An asynchronous function that seeds the database with sample campgrounds.
const seedDB = async () => {
    //deletes all existing campgrounds in the collection.
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author : '661cb2dc7c6c7a34683ae7d7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                coordinates:[
                    cities[random1000].longitude
                    ,cities[random1000].latitude
                ],
                type:"Point"
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dwxlc1isk/image/upload/v1716572973/YelpCamp/oi1l586rlqibmauomkgm.jpg',
                  filename: 'YelpCamp/oi1l586rlqibmauomkgm'
                },
                {
                  url: 'https://res.cloudinary.com/dwxlc1isk/image/upload/v1716572973/YelpCamp/aunmyu9vnzsaacf7e8t3.jpg',
                  filename: 'YelpCamp/aunmyu9vnzsaacf7e8t3'
                }
              ]
        })
        
        await camp.save();
        // console.log(camp)
    }
}

//The seeding function is executed, and the MongoDB connection is closed upon completion.
seedDB()
  .then(() => {
  mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error during seeding:", err);
    mongoose.connection.close();
  });