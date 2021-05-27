const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Joi = require('joi');
const User = require('../modals/user')
const _ = require("lodash");
const jwt = require("jsonwebtoken");



router.post('/register', (req, res) => {
    const { userId, password, userType, status } = req.body;

    const schema = Joi.object({
        userId: Joi.string().min(3).required(),
        userType: Joi.string().required(),
        password: Joi.string()
            .min(3)
            .max(10)
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .alphanum()
            .required(),
    });

    let data = { userId, userType, password: password };

    const { error } = schema.validate(data);

    if (error) return res.status(400).send(error.details[0].message);

    else {
        User.findOne({ userId: userId }).then(user => {
            if (user) return res.status(401).send('User Already Exits');

            const newUser = new User({
                userId,
                password,
                userType,
                status
            })

            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) return res.status(500).send("There Was problem registering the user");
                    //set password to hash
                    newUser.password = hash;
                    //save the user
                    newUser
                        .save()
                        .then((result) => {
                            var token = jwt.sign({ id: newUser._id, userType, status },
                                process.env.secret_key, {
                                    expiresIn: 1800, // expires in 30 min
                                }
                            );
                            res
                                .header("x-access-token", token)
                                .status(200)
                                .send(
                                    _.pick(newUser, [
                                        "_id",
                                        "userId",
                                        "status",
                                        "userType",
                                    ])
                                );
                        })
                        .catch((err) => console.log(err));
                })
            );

        })
    }

})


module.exports = router;