//This review controller file defines two main functions: createReview and deleteReview. 
//These functions handle the creation and deletion of reviews for campgrounds
const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //pushing reviews into the relavant list of the campground reviws
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success','Successfully added review')
    res.redirect(`/campgrounds/${id}`)
    // res.send("you made it")
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    const review = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}