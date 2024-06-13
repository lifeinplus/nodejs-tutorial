const bcrypt = require("bcrypt");

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    const foundUser = usersDB.users.find((user) => user.username === username);

    if (!foundUser) return res.sendStatus(401);

    try {
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
            return res
                .status(200)
                .json({ success: `User ${username} is logged in!` });
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };
