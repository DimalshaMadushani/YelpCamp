const mongoose = require('mongoose');
const Review = require('./review')
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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