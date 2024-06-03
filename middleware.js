//client side validation using joi
const {campgroundSchema,reviewSchema} = require('./schemas.js')
//custom error class
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

//isAuthenticated middleware is used to check if the user is logged in or not 
//passport provides this method to check if the user is authenticated or not

//// To resolve this issue, we will use a middleware function to transfer the returnTo value from the session (req.session.returnTo)
// to the Express.js app res.locals object before the passport.authenticate() function is executed in the /login POST route.
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    //The next() function is a callback that passes control to the next middleware function in the stack.
    // Without calling next(), the request would be left hanging, and the subsequent middleware functions or route handlers would not execute.
    next();
}

module.exports.isLoggedIn = (req,res,next) => {
    //This isAuthenticated method is provided by Passport.js to determine if the user is logged in.
    if(!req.isAuthenticated()){
        //this is where the user must be redirected , where they were initaily requesting
        req.session.returnTo = req.originalUrl; // add this line
        //When you use connect-flash in an Express.js application, it augments the req object with a flash method. 
        //This method is used to set flash messages that will be stored in the session and can be accessed in the next request.
        req.flash('error', 'You must be signed in first' );
        //The middleware then redirects the user to the login page. 
        //The return statement ensures that the function exits after the redirect, preventing any further processing.
        return res.redirect('/login')
    }
    next();
}

//joi validation middleware, only for post and put routes
module.exports.validateCampground = (req,res,next) => {
    //several properties, including error and value.
    //The destructuring assignment extracts the error property from the validation result object.
    //If the validation fails, error will contain details about what went wrong. If the validation passes, error will be undefined.
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

//grant permission to edit/delete for the owner of the campground
//This middleware checks if the currently logged-in user is the author of the campground they are trying to modify.
module.exports.isAuthor = async (req, res , next) => {
    const {id} =req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)){
        req.flash('error', "You do not have permission to update")
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

//This middleware validates the req.body against the reviewSchema.
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

//grant permission to delete for the owner of the review
module.exports.isReviewAuthor = async (req, res , next) => {
    const {reviewId, id} =req.params;
    const review = await Review.findById(reviewId);
    // console.log(review)
    if (!review.author.equals(req.user._id)){
        req.flash('error', "You do not have permission to delete")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}