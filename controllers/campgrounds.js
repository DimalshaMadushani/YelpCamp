const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")

//Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res,next) => {
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url : f.path, filename: f.filename}))
    //asscoiate the campground with the current logged in user who created it
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'Succesfully made a new Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}
//About populate 
//each review with the actual User document. This is a nested population.
// Second populates the author field of the campground document with the actual User document.
module.exports.showCampground = async (req, res,next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author')
    // console.log(campground)
    if(!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}

//About re.body and req.params
// The ID is obtained from req.params.id, which contains the route parameter (e.g., /campgrounds/:id).
module.exports.renderEditForm = async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url : f.path, filename: f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    // console.log(req.body.deleteImages)
    if(req.body.deleteImages){
        // console.log(req.body)
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        // filename is the field within each images array element that we are checking.
        // {$in: req.body.deleteImages}: The $in operator selects documents where the value of the filename field is in the 
        // specified array (req.body.deleteImages).
        await campground.updateOne({$pull: {images: {filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully updated  Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Succesfully Deleted the Campground.')
    res.redirect('/campgrounds');
}