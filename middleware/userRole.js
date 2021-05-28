const User = require('../modals/user')

module.exports = {
    applicant: async(req, res, next) => {
        const user = await User.findOne({ _id: req.user.id });

        if (!(user.userType === "applicant"))
            return res.status(403).send("Access Denied!");
        next();
    },
    admin: async(req, res, next) => {
        const user = await User.findOne({ _id: req.user.id });
        if (!(user.userType === "admin"))
            return res.status(403).send("Access Denied!");
        next();
    },
};