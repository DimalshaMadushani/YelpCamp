//isAuthenticated middleware is used to check if the user is logged in or not 
//passport provides this method to check if the user is authenticated or not

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req,res,next) => {
    // console.log("REQ.USER...", req.user);
    if(!req.isAuthenticated()){
        //this is where the user must be redirected , where they were initaily requesting
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first' );
        return res.redirect('/login')
    }
    next();
}