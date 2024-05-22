const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data',400)
    const campground = new Campground(req.body.campground);
    //asscoiate the campground with the current logged in user who created it
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Succesfully made a new Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}

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
    // //we need to find the cmapground first and update if only the currentUser owned the camp
    // const campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user._id)){
    //     req.flash('error', "You do not have permission to update")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated  Campground.!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Succesfully Deleted the Campground.')
    res.redirect('/campgrounds');
}