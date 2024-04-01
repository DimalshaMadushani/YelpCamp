const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema,reviewSchema} = require('./schemas.js')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review')
const { title } = require('process');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

//connect to database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery & monitoring engine
    useFindAndModify: false // Use `findOneAndUpdate()` and `findOneAndDelete()` without the `findAndModify` functionality
})
.then(() => {
    console.log("Mongo Database connected !!")
})
.catch(err => {
    console.log("Mongo Database connection error !!!")
    console.log(err)
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

//express router middleware 
app.use('/campgrounds',campgroundRoutes)

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/campgrounds/:id/reviews',reviewRoutes)

//app.all is a method provided by Express that is used to handle all types of HTTP requests 
//(GET, POST, PUT, DELETE, etc.) at a particular route. In this case, the route is specified as '*', which acts as a wildcard, matching any path.
app.all('*',(req,res,next) => {
    // res.status(404).send("404 !!")
    next(new ExpressError('Page Not Found',404))
})

//express error handling midleware
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!'
    //rendering the error.ejs file
    res.status(statusCode).render('error',{err})
    // res.send("oh nooo")
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})