const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');

//require the middleware which is in a seperate file
const {isLoggedIn , validateCampground , isAuthor} = require('../middleware')


// router.route('/')
router.get('/', catchAsync(campgrounds.index));


//create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/',isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground));

//show a campground
router.get('/:id', catchAsync(campgrounds.showCampground));


//edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put('/:id', isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.editCampground));

router.delete('/:id',isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router