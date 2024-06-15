const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.username = decoded.userInfo.username;
        req.roles = decoded.userInfo.roles;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = verifyJWT;
