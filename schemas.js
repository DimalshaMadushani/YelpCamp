//Library for JavaScript, often used with Node.js to validate data structures such as request payloads,
// query parameters, and configuration objects.. Joi provides server-side validation. 
//It is commonly used in server-side applications, especially in Node.js, to validate data before processing it.
const baseJoi  = require('joi')
const sanitizeHtml = require('sanitize-html')
//joi extension
const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = value.replace(/<script>/g, '');
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})

const Joi = baseJoi.extend(extention)
module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required().escapeHTML(),
        price : Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description : Joi.string().required().escapeHTML()
        
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body : Joi.string().required().escapeHTML()
    }).required()
})

