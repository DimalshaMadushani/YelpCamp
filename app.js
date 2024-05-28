// loads environment variables from a .env file only if the application is not running in a production environment.
if(process.env.NODE_ENV  !== 'production'){
    require('dotenv').config();
}

console.log(process.env.SECRET)
const express = require('express');
const app = express();
const path = require('path');
//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. 
//It provides a straightforward, schema-based solution to model your application data.
const mongoose = require('mongoose');
// ejs-mate is a package for Express.js that extends the EJS (Embedded JavaScript) templating engine.
const ejsMate = require('ejs-mate');

// By default, express-session uses cookies to store a session identifier on the client-side. 
// The actual session data is stored on the server-side, and the session identifier in the cookie is used to retrieve this data.
const session =  require('express-session')
//The connect-flash middleware is used in Express.js applications to manage flash messages. Flash messages are temporary messages used to convey information to the user, such as notifications, warnings, success messages, or errors. These messages are stored in the session and are designed to be displayed to the user only once, typically after a redirect.
const flash = require('connect-flash')

//By extending the Error class, ExpressError allows you to create custom error objects that include a message and a status code. This is useful for more precise error handling in your application.
//When an error occurs in your application, you can throw an ExpressError with a specific message and status code.
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override');
// Passport is an authentication middleware for Node.js that provides a set of plugins to handle authentication in your application.
const passport = require('passport')
//passport-local is a strategy for Passport.js that authenticates users using a username and password. It is called "local" because it uses the local database for authentication.
const LocalStrategy = require('passport-local')
// The User model is a Mongoose model that represents a user in the application.
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

app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


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
    //this is used to check if the user is authenticated or not to keep the track of the current user 
    res.locals.currentUser = req.user;
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