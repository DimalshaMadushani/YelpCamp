const {campgroundSchema,reviewSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

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

//joi validation middleware, only for post and put routes
module.exports.validateCampground = (req,res,next) => {
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

//grant permission to edit/delete for the owner of the campground
module.exports.isAuthor = async (req, res , next) => {
    const {id} =req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)){
        req.flash('error', "You do not have permission to update")
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

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