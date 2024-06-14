const fs = require("fs");
const path = require("path");

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(
        (user) => user.refreshToken === refreshToken
    );

    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.sendStatus(204);
    }

    try {
        const otherUsers = usersDB.users.filter(
            (user) => user.refreshToken !== refreshToken
        );

        const currentUser = { ...foundUser, refreshToken: "" };
        usersDB.setUsers([...otherUsers, currentUser]);

        await fs.promises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        );

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
