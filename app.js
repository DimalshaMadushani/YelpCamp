// loads environment variables from a .env file only if the application is not running in a production environment.
if(process.env.NODE_ENV  !== 'production'){
    require('dotenv').config();
}

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
const MongoStore = require('connect-mongo');

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
//this is used to sanitize the data to prevent the NoSQL injection
const mongoSanitize = require('express-mongo-sanitize');
//Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
const helmet = require('helmet')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const dbUrl = process.env.DB_URL 
//connect to database
//mongoose.connect: This method is used to establish a connection to the MongoDB database.
//Connection String: "mongodb://127.0.0.1:27017/pasan-camps"
//mongodb://: The protocol used to connect to MongoDB.
//127.0.0.1: The IP address of the MongoDB server. 127.0.0.1 refers to localhost, meaning the database server is running on the same machine as the application.
//27017: The default port number on which MongoDB listens for connections.
// yelp-camp: The name of the database you want to connect to. If the database does not exist, MongoDB will create it for you when you insert the first document.
// mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect(dbUrl, {
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

//serves static assets from the public directory.
app.use(express.static(path.join(__dirname,'public')))
//Configures EJS Mate as the template engine.
//A template engine in the context of web development is a tool used to generate HTML output by combining static templates with dynamic data.
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
// Sets the directory for view templates.
app.set('views', path.join(__dirname, 'views'))
//The express.urlencoded middleware parses the URL-encoded data and makes it available on req.body.
// If you have a form with fields name and age, after parsing, you can access these values as req.body.name and req.body.age.
app.use(express.urlencoded({ extended: true }));
//allows the use of HTTP methods like PUT and DELETE in forms.
app.use(methodOverride('_method'));
//this is used to sanitize the data to prevent the NoSQL injection
app.use(mongoSanitize());

//The MongoStore module is used to store session data in MongoDB.
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET,
    }
});
// Sets up and configures the session middleware with security settings and expiration details.
const sessionConfig = {
    store, name : 'session',
    // A string used to sign the session ID cookie. It should be a complex, random string to enhance security.
    secret : process.env.SECRET,
    // When set to false, it prevents the session from being saved back to the session store if it wasn't modified during the request.
    resave: false,
    //// This setting will save new, unmodified sessions to the session store. As soon as a user visits your site and a session is created, it will be stored.
    saveUninitialized: true,
    cookie: { 
        // name : session,
        // The cookie is not accessible via client-side JavaScript, enhancing security.
        httpOnly : true,
        // secure:true,
        // Sets a specific expiration date and time for the cookie, providing absolute control over its lifetime.
        expires:  Date.now() + 1000*60*60*24*7,
        // Defines the maximum age for the cookie in milliseconds, offering a relative expiration time from the moment it is set.
        maxAge: 1000*60*60*24*7
    }   
}
// This line uses the session middleware with the configuration defined above. 
// It initializes session handling for the application, allowing you to store and manage session data.
app.use(session(sessionConfig))
// This line uses the flash middleware. It initializes flash messages for the application, allowing you to display temporary messages to the user.
app.use(flash())
//middleware to set the security headers
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://conoret.com",
  ];
  const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com"
  ];
  const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
  ];
  const fontSrcUrls = ["https://cdnjs.cloudflare.com"];
  app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwxlc1isk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://cdn.dribbble.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
  );
// Initializes Passport, which is used for authentication.
app.use(passport.initialize())
// Integrates Passport with the Express session. This allows Passport to serialize and deserialize user information and manage persistent login sessions.
app.use(passport.session())
//Configures Passport to use the local strategy for authentication. User.authenticate() is a method provided by Passport-Local Mongoose to handle the authentication process.
passport.use(new LocalStrategy(User.authenticate()))
//Defines how user information is stored in the session. User.serializeUser() is a method provided by Passport-Local Mongoose to serialize user instances to the session.
passport.serializeUser(User.serializeUser())
//Defines how user information is retrieved from the session. User.deserializeUser() is a method provided by Passport-Local Mongoose to deserialize user instances from the session
passport.deserializeUser(User.deserializeUser())

//This middleware runs on every request and sets local variables that will be available in all templates
//res.locals is an object that contains response local variables scoped to the request. 
//Variables set on res.locals are available to the view(s) rendered during that request/response cycle (if any).
//req.flash is a function provided by the connect-flash middleware, which is used for storing and retrieving messages, 
// typically for one-time-only messages like success or error notifications. 
// Messages stored in flash are written to the session, and they are cleared after being displayed to the user. 
app.use((req,res,next) => {
    // console.log(req.query)
    //this is used to check if the user is authenticated or not to keep the track of the current user 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

// Mounts the user routes on the root path.
app.use('/',userRoutes)
// Mounts the campground routes on /campgrounds.
app.use('/campgrounds',campgroundRoutes)
// Mounts the review routes on /campgrounds/:id/reviews.
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
// This middleware Provides a centralized place to handle all errors that occur in the application.
// res.status(statusCode): Sets the HTTP status code of the response to the statusCode determined earlier.
// .render("error", { err }): Renders an error view template (e.g., error.ejs) and passes the err
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!'
    //rendering the error.ejs file
    res.status(statusCode).render('error',{err})
})

//This line starts the Express server on port 3000.
app.listen(3000, () => {
    console.log('Serving on port 3000')
})