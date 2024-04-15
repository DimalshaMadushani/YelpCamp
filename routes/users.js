// const express = require('express')
// const router = express.Router({mergeParams: true});
// const { storeReturnTo } = require('../middleware');
// const User = require('../models/user');
// const passport = require('passport')

// const catchAsync = require('../utils/catchAsync')

// router.get('/register',(req,res) => {
//     res.render('users/register')
// })

// router.post('/register',catchAsync(async (req,res, next) => {
//     try {
//         const {email, username, password} = req.body;
//         const user = new User({email, username});
//         const registeredUser = await User.register(user, password);
//         //this method which is from passport , login the user once someone is registered
//         req.login(registeredUser, err => {
//             if(err) return next(err);
//             req.flash('success','Welcome to YelpCamp')
//             res.redirect('/campgrounds')
//         })
//     } catch(e) {
//         req.flash('error',e.message)
//         res.redirect('/register')
//     }
    
// }))

// router.get('/login',(req,res) => {
//     res.render('users/login')
// })



// //this passport authenticate is a middleware that is used to authenticate the user 
// //local is the strategy that we are using to authenticate the user by checking the username and password on the database
// //we can use multiple strategies like google, facebook etc
// router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}), (req,res) => {
//     req.flash('success', 'Welcome Back !')
//     const redirectUrl = req.locals.returnTo || '/campgrounds'
//     delete req.session.returnTo
//     console.log(redirectUrl)
//     res.redirect(redirectUrl)
// })

// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/campgrounds');
//     });
// }); 




// module.exports = router

const express = require("express");
const router = express.Router({ mergeParams: true });
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
    "/register",
    catchAsync(async (req, res, next) => {
        try {
            const { email, username, password } = req.body.user;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to Pasan Camps!");
                res.redirect("/campgrounds");
            });
        } catch (e) {
            req.flash("error", e.message)
            res.redirect("/register")
        }
    }))

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Good Bye!");
        res.redirect("/campgrounds");
    });
})

module.exports = router;