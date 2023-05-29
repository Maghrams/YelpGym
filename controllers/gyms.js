const GymModel = require("../models/gym");
const User = require("../models/user");
const {cloudinary} = require("../cloudinary");

/*
This function `addGoogleAutoTagging` takes an array of Cloudinary image `publicIds`.

It updates each image with Google auto-tagging, setting categorization to 'google_tagging' and threshold to 0.6.

It logs the tags assigned to each image.

If there's an error, it logs the error message.
 */
const addGoogleAutoTagging = async (publicIds) => {
    try {
        const updatePromises = publicIds.map(async (publicId) => {
            const result = await cloudinary.api.update(publicId, {
                categorization: 'google_tagging',
                auto_tagging: 0.6,
            });
            console.log("that start of this");
            console.log(result.tags)
            console.log("the end of this");
        });

        await Promise.all(updatePromises);
    } catch (error) {
        console.error('Error updating images with auto-tagging:', error);
    }
};

/*
This code exports an asynchronous function called `index`.

The function queries the database for all documents in the `GymModel` collection.

Then, it renders the "gyms/index" view with the query results as a variable named `allGyms`.
 */
module.exports.index = async (req, res) => {
    const allGyms = await GymModel.find({});
    res.render("gyms/index", {allGyms});
}

/*
This code exports a function called renderNewForm.

The function renders the "gyms/new" view when called.
 */
module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
}

/*
This code exports an asynchronous function called createGym. Here's a breakdown of its functionality:

It maps the req.files array to an array of objects containing url and filename properties.
It creates a new GymModel instance with the data from req.body.gym.
It assigns the mapped array of image objects to the gym.images property.
It assigns the current user's _id to the gym.owner property.
It saves the new gym document to the database.
It logs the saved gym object to the console.
It flashes a "success" message indicating that a new gym has been created.
It redirects the user to the gym's detail page using the gym's _id.
 */
module.exports.createGym = async (req, res, next) => {
    req.files.map(f =>({url: f.path, filename: f.filename}));
    const gym = new GymModel(req.body.gym);
    gym.images = req.files.map(f =>({url: f.path, filename: f.filename}));
    gym.owner = req.user._id;
    await gym.save();
    console.log(gym);
    req.flash("success", "Successfully made a new gym!");
    res.redirect(`/gyms/${gym._id}`);
}

/*
This code exports an asynchronous function called createGym. Here's a breakdown of its functionality:

It creates a new GymModel instance with the data from req.body.gym.
It assigns the mapped array of image objects, generated from req.files, to the gym.images property.
It assigns the current user's _id to the gym.owner property.
It saves the new gym document to the database.
It calls the addGoogleAutoTagging function with the publicIds of the uploaded images to add Google auto-tagging to the images.
It flashes a "success" message indicating that a new gym has been created.
It redirects the user to the gym's detail page using the gym's _id.
 */
module.exports.createGym = async (req, res, next) => {
    const gym = new GymModel(req.body.gym);
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.owner = req.user._id;
    await gym.save();

    // Add Google auto-tagging to the uploaded images
    const publicIds = req.files.map(f => f.filename);
    await addGoogleAutoTagging(publicIds);

    req.flash("success", "Successfully made a new gym!");
    res.redirect(`/gyms/${gym._id}`);
};

/*
This code exports an asynchronous function called showGym. Here's a breakdown of its functionality:

It tries to find a gym document in the GymModel collection by its ID, populating the related review authors and the gym owner.
If the gym is not found, it flashes an error message and redirects to the '/gyms' route.
It fetches the tags for each image in gym.images by calling the cloudinary.api.resource function with the image's publicId.
It maps the images to an array of image tags and flattens the array into a single-level array called flattenedTags.
It renders the 'gyms/show' view, passing the gym object and the flattened tags array.
If there's an error in any part of the process, it logs the error, flashes an error message, and redirects to the '/gyms' route.
 */
module.exports.showGym = async (req, res) => {
    try {
        const gym = await GymModel.findById(req.params.id)
            .populate({
                path: 'totalReview.reviews',
                populate: {
                    path: 'author',
                },
            })
            .populate('owner');

        if (!gym) {
            req.flash('error', 'Cannot find that gym!');
            return res.redirect('/gyms');
        }

        // Fetch tags for each image in gym.images
        const imagePromises = gym.images.map(async (image) => {
            try {
                const publicId = image.filename;
                const imageDetails = await cloudinary.api.resource(publicId);
                const tags =
                    imageDetails &&
                    imageDetails.info &&
                    imageDetails.info.categorization &&
                    imageDetails.info.categorization.google_tagging &&
                    imageDetails.info.categorization.google_tagging.data
                        ? imageDetails.info.categorization.google_tagging.data
                        : [];
                return tags;
            } catch (error) {
                console.error('Error fetching tags for image:', image.filename, error);
                return []; // Return an empty array in case of an error
            }
        });

        // Add the tags to the gym object
        const allTags = await Promise.all(imagePromises);
        const flattenedTags = [].concat(...allTags); // Flatten the array of tags

        res.render('gyms/show', { gym, tags: flattenedTags });
    } catch (error) {
        console.error('Error in showGym route:', error);
        req.flash('error', 'Oh no, something went wrong!');
        res.redirect('/gyms');
    }
};

/*
This code exports an asynchronous function called renderEditForm. Here's a breakdown of its functionality:

It destructures the id from req.params.
It tries to find a gym document in the GymModel collection by its ID, populating the gym owner.
If the gym is not found, it flashes an error message and redirects to the '/gyms' route.
If the gym is found, it renders the 'gyms/edit' view, passing the gym object.
 */
module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id).populate("owner");
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    res.render("gyms/edit", {gym});
};

/*
updateGym:

It destructures the id from req.params.
It creates an ownerDetails object with the owner's name, phone number, and email from the request body.
It updates the owner's details in the User collection by its _id.
It updates the gym's details in the GymModel collection by its ID.
It maps the uploaded files and adds the new images to the gym's images property, then saves the gym document.
It adds Google auto-tagging to the uploaded images.
If there are images to delete, it destroys the images on Cloudinary and removes them from the gym document.
It flashes a "success" message and redirects to the updated gym's detail page.
 */
module.exports.updateGym = async (req, res) => {
    const {id} = req.params;
    console.log(req.body)
    const ownerDetails = {
        name: req.body.gym["owner.name"],
        phoneNumber: req.body.gym["owner.phoneNumber"],
        email: req.body.gym["owner.email"],
    };
    await User.findByIdAndUpdate(req.user._id, ownerDetails);
    const gym = await GymModel.findByIdAndUpdate(id, {
        name: req.body.gym.name,
        address: {
            streetName: req.body.gym["address.streetName"],
            city: req.body.gym["address.city"],
            contactNumber: req.body.gym["address.contactNumber"],
        },
        hours: req.body.gym.hours,
    });

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.images.push(...imgs);
    await gym.save();
    // Add Google auto-tagging to the uploaded images
    const publicIds = req.files.map(f => f.filename);
    await addGoogleAutoTagging(publicIds);

    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(gym, req.body.deleteImages)
    }
    req.flash("success", "Successfully updated gym!");
    res.redirect(`/gyms/${gym._id}`);
};

/*
deleteGym:

It destructures the id from req.params.
It finds the gym by its ID in the GymModel collection.
It removes the gym document from the GymModel collection by its ID.
It flashes a "success" message and redirects to the "/gyms" route.
 */
module.exports.deleteGym = async (req, res) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id);
    await GymModel.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted gym!");
    res.redirect("/gyms");
}
