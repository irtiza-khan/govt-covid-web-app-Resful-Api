const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../modals/user");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/auth");

router.post("/", async(req, res) => {
    const { userId, password } = req.body;

    const schema = Joi.object({
        userId: Joi.string().min(3).required(),
        password: Joi.string()
            .min(3)
            .max(10)
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .alphanum()
            .required(),
    });
    let data = { userId, password: password };
    const { error } = schema.validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ userId: userId });

    if (!user) return res.status(404).send("No user found.");

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
        return res.status(401).send({ auth: false, token: null, message: "Invalid Password" });

    User.findByIdAndUpdate({ _id: user._id }, { $set: { status: "Active" } }, { upsert: true },
        function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                var token = jwt.sign({ id: user._id }, process.env.secret_key, {
                    expiresIn: 1800, // expires in 24 hours
                });
                res
                    .header("x-access-token", token)
                    .status(200)
                    .send({ auth: true, token: token });
            }
        }
    );
});

module.exports = router;