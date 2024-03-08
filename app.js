const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { title } = require('process');

//connect to databse
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',)
//     .then(() => {
//         console.log("Mongo Database connected !!")
//     })
//     .catch(err => {
//         console.log("Mongo Database connection error !!!")
//         console.log(err)
//     })
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


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', catchAsync(async (req, res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


//create a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data',400)
    //this is just a schema for joi to validate
    const campgroundSchema = Joi.object({
        campground : Joi.object({
            title : Joi.string().required(),
            price : Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required()
            
        }).required()
    })
    //
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    // console.log(result)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

//show a campground
app.get('/campgrounds/:id', catchAsync(async (req, res,next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));


//edit a campground
app.get('/campgrounds/:id/edit', async (req, res,next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

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