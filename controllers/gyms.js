const GymModel = require("../models/gym");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const allGyms = await GymModel.find({});
    res.render("gyms/index", {allGyms});
}

module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
}

module.exports.createGym = async (req, res, next) => {
    const gym = new GymModel(req.body.gym);
    gym.owner = req.user._id;
    await gym.save();
    req.flash("success", "Successfully made a new gym!");
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.showGym = async (req, res) => {
    const gym = await GymModel.findById(req.params.id)
        .populate({
            path:"totalReview.reviews",
            populate:{
                path:"author"
            }
        })
        .populate("owner");
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    res.render("gyms/show", {gym});
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
        image: req.body.gym.image,
    });
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