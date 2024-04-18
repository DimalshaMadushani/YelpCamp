const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
//require the middleware which is in a seperate file
const {isLoggedIn , validateCampground , isAuthor} = require('../middleware')

router.get('/', catchAsync(async (req, res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


//create a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/',isLoggedIn,validateCampground, catchAsync(async (req, res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data',400)
    const campground = new Campground(req.body.campground);
    //asscoiate the campground with the current logged in user who created it
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Succesfully made a new Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

//show a campground
router.get('/:id', catchAsync(async (req, res,next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author')
    // console.log(campground)
    if(!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}));


//edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor,async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
});

router.put('/:id', isLoggedIn,isAuthor,validateCampground,catchAsync(async (req, res,next) => {
    const { id } = req.params;
    // //we need to find the cmapground first and update if only the currentUser owned the camp
    // const campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user._id)){
    //     req.flash('error', "You do not have permission to update")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated  Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id',isAuthor, catchAsync(async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Succesfully Deleted the Campground.')
    res.redirect('/campgrounds');
}));

module.exports = router