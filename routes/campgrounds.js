const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');

//require the middleware which is in a seperate file
const {isLoggedIn , validateCampground , isAuthor} = require('../middleware')


router.route('/')
    .get( catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground));


//create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.editCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

//edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);


module.exports = router