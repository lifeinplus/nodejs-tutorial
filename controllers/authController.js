const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser) return res.sendStatus(401);

    try {
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                { userInfo: { username: foundUser.username, roles } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );

            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            console.log(result);

            return res
                .cookie("jwt", refreshToken, {
                    httpOnly: true,
                    sameSite: "None",
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                })
                .json({ accessToken });
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };
