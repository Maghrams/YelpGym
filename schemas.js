const Joi = require('joi');

module.exports.gymValidationSchema = Joi.object({

    gym: Joi.object({
        name: Joi.string().required(),
        // TODO make wokring hours an array for ease od use
        hours: Joi.string().required(),
        // image: Joi.string(),
        email: Joi.string().email(),
        website: Joi.string(),
        address: Joi.object({
            city: Joi.string().required(),
            streetName: Joi.string().required(),
            contactNumber: Joi.string().required(),
        }),
        owner: Joi.object({
            name: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            email: Joi.string().email().required(),
        })

    }).required().unknown(true)
})

module.exports.reviewValidationSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required().unknown(true)
})



