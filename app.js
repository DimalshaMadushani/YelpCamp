const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const session =  require('express-session')
const flash = require('connect-flash')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review')
const { title } = require('process');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

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

const sessionConfig = {
    //used to sign the session ID cookie. 
    secret : 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly : true,
        expires:  Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }   
    
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//res.locals is an object that contains response local variables scoped to the request. 
//Variables set on res.locals are available to the view(s) rendered during that request/response cycle (if any).
//req.flash is a function provided by the connect-flash middleware, which is used for storing and retrieving messages, 
// typically for one-time-only messages like success or error notifications. 
// Messages stored in flash are written to the session, and they are cleared after being displayed to the user. 
// Here, req.flash('success') retrieves messages stored under the key 
app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

// app.get('/fakeUser',async (req,res) => {
//     const user = new User({email:'mad@gmail.com', username: 'maddd'});
//     const newUser = await User.register(user,'cat')
//     res.send(newUser)
// })


//express router middleware 
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


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