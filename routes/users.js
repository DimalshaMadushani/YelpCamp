const express = require('express')
const router = express.Router({mergeParams: true});
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware');
const User = require('../models/user');
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')

router.get('/register', users.renderRegister)

router.post('/register',catchAsync(users.registerUser))

router.get('/login',users.renderLogin)

//this passport authenticate is a middleware that is used to authenticate the user 
//local is the strategy that we are using to authenticate the user by checking the username and password on the database
//we can use multiple strategies like google, facebook etc
router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}), users.logUser)

router.get('/logout', users.logoutUser); 

module.exports = router
