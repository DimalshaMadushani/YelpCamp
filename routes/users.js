const express = require('express')
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')
// const ExpressError = require('../utils/ExpressError')
// const Campground = require('../models/campground');
// const {reviewSchema} = require('../schemas.js')


router.get('/register',(req,res) => {
    res.render('users/register')
})

router.post('/register',catchAsync(async (req,res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success','Welcome to YelpCamp')
        res.redirect('/campgrounds')

    } catch(e) {
        req.flash('error',e.message)
        res.redirect('/register')
    }
    

}))

router.get('/login',(req,res) => {
    res.render('users/login')
})



//this passport authenticate is a middleware that is used to authenticate the user 
//local is the strategy that we are using to authenticate the user by checking the username and password on the database
//we can use multiple strategies like google, facebook etc
router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}), async(req,res) => {
    req.flash('success', 'Welcome Back !')
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router