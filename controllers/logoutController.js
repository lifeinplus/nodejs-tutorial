const User = require("../model/User");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.sendStatus(204);
    }

    try {
        foundUser.refreshToken = "";
        const result = await foundUser.save();
        console.log(result);

        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogout };
