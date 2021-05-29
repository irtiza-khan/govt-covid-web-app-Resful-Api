const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const grantSchema = new Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
    },
    rationDonated: {
        type: Array,
        required: true,
    },
    fundsGranted: {
        type: String,
        required: true,
    },
});

const Grant = mongoose.model("Grant", grantSchema);
module.exports = Grant;