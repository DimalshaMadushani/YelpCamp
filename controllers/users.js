const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register')
}


module.exports.registerUser = async (req,res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        //User.register(user, password): Registers the user with the specified password. This method is provided by Passport.js, which integrates with Mongoose to hash the password and store it securely.
        //an error can be thrown from this method if the user is already registered , so we need to catch that error using this large try catch block
        const registeredUser = await User.register(user, password);
        //this method which is from passport , login the user once someone is registered
        //If an error occurs during login, return next(err) is called to pass the error to the next middleware or error handler.
        //If login is successful, req.flash("success", "Welcome to Pasan Camps!") sets a success flash message.
        //res.redirect("/campgrounds"): Redirects the user to the campgrounds page.
        req.login(registeredUser, err => {
            if(err) return next(err); //// Since catchAsync wraps the entire registerUser function, any error passed to next will be caught by catchAsync.
            req.flash('success','Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    } catch(e) {
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login')
}


module.exports.logUser = (req,res) => {
    req.flash('success', 'Welcome Back !')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    //delete req.session.returnTo 
    res.redirect(redirectUrl)
}

//About logout function
// req.logout(function (err) { ... }): Logs out the user. This is provided by Passport.js.
// Error Handling: If there is an error during logout, it passes the error to the next middleware.
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}