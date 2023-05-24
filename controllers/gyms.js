const GymModel = require("../models/gym");
const User = require("../models/user");
const {cloudinary} = require("../cloudinary");

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


module.exports.index = async (req, res) => {
    const allGyms = await GymModel.find({});
    res.render("gyms/index", {allGyms});
}

module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
}

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

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id).populate("owner");
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    res.render("gyms/edit", {gym});
};

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

module.exports.deleteGym = async (req, res) => {
    const {id} = req.params;
    const gym = await GymModel.findById(id);
    await GymModel.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted gym!");
    res.redirect("/gyms");
}