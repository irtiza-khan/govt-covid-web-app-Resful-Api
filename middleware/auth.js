const jwt = require("jsonwebtoken");

module.exports = function isAuthenticated(req, res, next) {
    const token = req.header("x-access-token");
    if (!token)
        return res.status(401).send("Access Denied! Token not provided");

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (ex) {
        res.sendStatus(403);
    }


}