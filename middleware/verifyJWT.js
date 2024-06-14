const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.sendStatus(401);

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.username = decoded.username;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = verifyJWT;
