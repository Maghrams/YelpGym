/*
imports the necessary modules, including Cloudinary, Multer, and the Cloudinary storage engine for Multer.
 */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

//Configure Cloudinary object with the credentials from the .env file.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

/*
create a new instance of the CloudinaryStorage engine with the Cloudinary client and some additional parameters.
It specifies that the folder for storing uploaded files should be
"YelpGym" and the allowed file formats are 'jpeg', 'png', and 'jpg'.
*/
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'YelpGym',
        allowedFormats: ['jpeg','png','jpg']
    }
})

/*
exports the Cloudinary client and the storage engine for use in other parts of the application.
 */
module.exports = {
    cloudinary,
    storage
}