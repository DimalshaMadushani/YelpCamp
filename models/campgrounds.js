const mongoose = require('mongoose')
//just assign the Schema word to mongoose.schema
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema ({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String
});

module.exports = mongoose.model('Campground',CampgroundSchema);