const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating a user schema ;

const applicationSchema = new Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    numberOfDependents: {
        type: String,
        required: true,
    },
    fundRequired: {
        type: String,
        required: true,
    },
    rationRequired: {
        type: Array,
        required: true,
    },
    statusOfApplication: {
        type: String,
        required: true,
        default: "Pending",
    },
});



const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;