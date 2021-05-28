const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("Access Denied! Token not provided");

    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = decoded;
        next();
    } catch (ex) {
        res.sendStatus(403);
    }

}