const express = require('express');
//By using router, you create a modular and maintainable structure for your application’s routing, making it easier to scale and manage your codebase.
const router = express.Router();
// The campgrounds controller contains functions that define the logic for handling requests to the /campgrounds route.
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')

//require the middleware which is in a seperate file
const {isLoggedIn , validateCampground , isAuthor} = require('../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

//about post request
//upload.array("image"): This middleware handles the uploading of multiple files (images in this case) attached to the field named image in the form. The uploaded files are processed using the storage configuration from Cloudinary.
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    
//create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.editCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

//edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);


module.exports = router