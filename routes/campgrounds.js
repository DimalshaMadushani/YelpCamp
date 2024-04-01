const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js')

//joi validation middleware, only for post and put routes
const validateCampground = (req,res,next) => {
    //validating the request.body
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}


router.get('/', catchAsync(async (req, res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


//create a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/',validateCampground, catchAsync(async (req, res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data',400)
    //this is just a schema for joi to validate
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

//show a campground
router.get('/:id', catchAsync(async (req, res,next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}));


//edit a campground
router.get('/:id/edit', async (req, res,next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
});

router.put('/:id', validateCampground,catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', catchAsync(async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router