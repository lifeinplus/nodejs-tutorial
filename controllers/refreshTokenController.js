const jwt = require("jsonwebtoken");

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(
        (user) => user.refreshToken === refreshToken
    );

    if (!foundUser) return res.sendStatus(403);

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (foundUser.username !== decoded.username) {
            return res.sendStatus(403);
        }

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            { userInfo: { username: decoded.username, roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        return res.json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleRefreshToken };
