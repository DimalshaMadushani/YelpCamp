const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middleware')

// route to handle the post requests for a campground reviws
router.post('/',isLoggedIn,validateReview, catchAsync(async (req, res,next) => {
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
}))

// deleting a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async(req,res) => {
    const {id, reviewId} = req.params;
    const review = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router