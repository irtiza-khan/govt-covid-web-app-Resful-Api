const express = require("express");
const router = express.Router();
const { admin } = require("../middleware/userRole");
const Grant = require("../modals/grant");
const isAuthenticated = require("../middleware/auth");
const Application = require("../modals/application");
const Joi = require("joi");

//*api for rations grant
router.post("/:id", [isAuthenticated, admin], (req, res) => {
    const { applicationId, rationDonated, fundsGranted } = req.body;
    const id = req.params.id;

    const schema = Joi.object({
        rationDonated: Joi.required(),
        fundsGranted: Joi.string().required(),
    });

    let data = {
        rationDonated,
        fundsGranted,
    };
    const { error } = schema.validate(data);

    if (error) return res.status(400).send(error.details[0].message);
    Grant.findOne({
        applicationId: id,
    }).then((grant) => {
        if (grant) return res.status(401).send("Application Granted");

        const newGrant = new Grant({
            applicationId: id,
            rationDonated,
            fundsGranted,
        });

        newGrant
            .save()
            .then((result) => {
                Application.findOneAndUpdate({ _id: id }, {
                        $set: { statusOfApplication: "Completed" },
                    },
                    function(err, docs) {
                        if (err) {
                            res.status(401).send(err);
                        } else {
                            return res.status(200).send("Application Granted");
                        }
                    }
                );
                res.status(200).send({ message: "Application Successfully granted", result });
            })
            .catch((err) => console.log(err));
    });

});


//* api to view all the grants collections



router.get("/", [isAuthenticated, admin], async(req, res) => {
    try {
        const grants = await Grant.find();
        return res.status(200).send({ message: "All Granted Rations", grants });
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;