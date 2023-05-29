const Joi = require('joi');

module.exports.gymValidationSchema = Joi.object({

    // The main gym object: \n
    // - Gym name is a required string \n
    // - Gym hours is a required array of objects with day, open, and close properties \n
    // -- The day of the week (e.g., "Monday") \n
    // -- The opening time (e.g., "09:00") \n
    // -- The closing time (e.g., "18:00") \n
    // - Optional: image field (uncomment if necessary) \n
    // - Optional: email field, validated as an email address \n
    // - Optional: website field, any string \n
    // - Address object with required city, streetName, and contactNumber \n
    // - Gym owner object with required name, phoneNumber, and email \n
    // - Allow additional unknown fields in the gym object \n
    // - Optional: deleteImages field as an array of strings \n
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

    }).required().unknown(true),
    deleteImages: Joi.array()
})

module.exports.reviewValidationSchema = Joi.object({
    // The main review object: \n
    // - Body is a required string \n
    // - Rating is a required number with a minimum value of 1 and a maximum value of 5 \n
    // - Allow additional unknown fields in the review object \n
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required().unknown(true)
})



