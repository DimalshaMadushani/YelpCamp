const express = require('express');
const router = express.Router({mergeParams: true});// mergeParams: true is required to access the params from the parent router
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middleware')

// route to handle the post requests for a campground reviws
router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview))

// deleting a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router