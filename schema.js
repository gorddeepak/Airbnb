const Joi = require('joi'); 

module.exports.ListingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("",null),
        price: Joi.number().integer().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports.ReviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().required(),
        createdAt : Joi.date(),
    }).required(),
});