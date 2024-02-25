
const mongoose = require('mongoose');
const axios = require('axios');
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

// const getRandomImage = async () => {
//     try {
//         const response = await axios.get('https://api.unsplash.com/photos/random', {
//             params: {
//                 client_id: 'PSrBaQYPCln4kqrTpE3pABs-XKOG8u9K9zNtLs10lns', // Replace with your Unsplash access key
//                 // You can add more parameters here to customize the returned images
//             }
//         });
//         return response.data.urls.regular; // or whichever image size you prefer
//     } catch (error) {
//         console.error("Error fetching image from Unsplash:", error);
//         return 'default-image-url'; // Fallback image URL in case of an error
//     }
// };

//removing everthing in the database
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i< 20; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price =  Math.floor(Math.random() * 30) + 10;
        const camp = await Campground.create({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:getRandomImage(),
            // image:'https://api.unsplash.com/photos/random/?client_id=PSrBaQYPCln4kqrTpE3pABs-XKOG8u9K9zNtLs10lns',
            // image:'D:\My classes\Web Development\Web-Development\YelpCamp\seeds\camp_image.png',
            image:'https://images.unsplash.com/photo-1631451725131-d79ddd78da8f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas explicabo dicta non doloremque veritatis nostrum maxime ea facere eum ut perferendis, vero dolorum reiciendis voluptatum aliquid in temporibus soluta commodi!',
            price : price

        })
    }
   
}

seedDB().then(() => {
    mongoose.connection.close()
}) 