const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review');
const Campground = require('../models/campground');
const {reviewSchema} = require('../schemas.js')

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

// route to handle the post requests for a campground reviws
router.post('/',validateReview, catchAsync(async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review);
    //pushing reviews into the relavant list of the campground reviws
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`)
    // res.send("you made it")
}))

// deleting a review
router.delete('/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router