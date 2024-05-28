const mongoose = require('mongoose');
const Review = require('./review')
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dwxlc1isk/image/upload/w_300/v1716567898/YelpCamp/gvg7g1irbfolbpgbz3ke.jpg

const ImageSchema = new Schema({
    url  : String,
    filename : String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    //include reviews in the campground schema
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});
//setting up the query middlware for delete
// we are passing the thing that we just deleted 'campground as an argument to the function
CampgroundSchema.post('findOneAndDelete',async function(campground) {
    // console.log("Deleted !!")
    if(campground.reviews.length){
        // we are gonna delete all the reviews whose id is in campground.reviews array
        const result = await Review.deleteMany({_id: {$in: campground.reviews}})
        // console.log(result)
    }

})
module.exports = mongoose.model('Campground', CampgroundSchema);