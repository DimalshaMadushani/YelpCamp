const express = require('express')
const router = express.Router({mergeParams: true});
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware');
const User = require('../models/user');
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))

//this passport authenticate is a middleware that is used to authenticate the user 
//local is the strategy that we are using to authenticate the user by checking the username and password on the database
//we can use multiple strategies like google, facebook etc
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}), users.logUser)

//about post route in login
// To resolve this issue, we will use a middleware function to transfer the returnTo value from 
//the session (req.session.returnTo) to the Express.js app res.locals object before the passport.authenticate() function is executed in the /login POST route.
router.get('/logout', users.logoutUser); 

module.exports = router
