const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req,res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        //this method which is from passport , login the user once someone is registered
        req.login(registeredUser, err => {
            if(err) return next(err);
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
    delete req.session.returnTo
    console.log(redirectUrl)
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}