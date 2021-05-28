const express = require("express");
const router = express.Router();
const Application = require("../modals/application");
const isAuthenticated = require("../middleware/auth");
const Joi = require("joi");
const { applicant, admin } = require("../middleware/userRole");

router.post("/resident/submit", [isAuthenticated, applicant], (req, res) => {
    const {
        applicantId,
        numberOfDependents,
        fundRequired,
        rationRequired,
        statusOfApplication,
    } = req.body;
    const data = {
        applicantId,
        numberOfDependents,
        fundRequired,
        rationRequired,
        statusOfApplication,
    };

    //TODO:  Validation Not working
    // const schema = Joi.object({
    //     applicantId: Joi.string().required,
    //     numberOfDependents: Joi.string().required,
    //     fundRequired: Joi.string().required,
    //     rationRequired: Joi.string().required,
    //     statusOfApplication: Joi.string().required,
    // });

    // const { error } = schema.validate(data);

    // if (error) return res.status(400).send(error.details[0].message);
    Application.findOne({ applicantId: req.user.id }).then((app) => {
        if (app) return res.status(401).send("Application already exits");

        const newApplication = new Application({
            applicantId: req.user.id,
            numberOfDependents,
            fundRequired,
            rationRequired,
            statusOfApplication,
        });

        newApplication.save().then((result) => {
            res.send({ message: "Your Application Submitted Successfully", result });
        });
    });
});

//* Api for Resident to see his application
router.get("/resident", [isAuthenticated, applicant], async(req, res) => {
    try {
        const application = await Application.findOne({
            applicantId: req.user.id,
        });
        return res.status(200).send(application);

    } catch (err) {
        return res.status(400).send(err);
    }

});


//*api for all the submittied  apllications 

router.get('/', [isAuthenticated, admin], async(req, res) => {
    try {
        const applications = await Application.find();
        return res.status(200).send({
            message: "All The Submitted Appllications",
            applications
        });

    } catch (err) {
        return res.status(400).send(err);
    }
})



//*api for all the pending applications
router.get("/pending", [isAuthenticated, admin], async(req, res) => {
    try {
        const applications = await Application.find({
            statusOfApplication: { $eq: "Pending" },
        });

        if (applications) {
            return res.status(200).send({
                message: "All The Pending  Appllications",
                applications,
            });

        } else {
            return res.status(500).send("No Pending Application");
        }

    } catch (err) {
        return res.status(400).send(err);
    }
});


//*api for all completed applications
router.get("/completed", [isAuthenticated, admin], async(req, res) => {
    try {
        const applications = await Application.find({
            statusOfApplication: { $eq: "Completed" },
        });

        if (applications) {
            return res.status(200).send({
                message: "All The Completed  Appllications",
                applications,
            });
        } else {
            return res.status(500).send("No Completed Application");
        }

    } catch (err) {
        return res.status(400).send(err);
    }
});



function validate(data) {
    const schema = Joi.object({
        applicantId: Joi.string().required,
        numberOfDependents: Joi.string().required,
        fundRequired: Joi.string().required,
        rationRequired: Joi.string().required,
        statusOfApplication: Joi.string().required,
    });

    return schema.validate(data);
}
module.exports = router;