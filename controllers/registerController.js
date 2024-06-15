const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    const duplicate = usersDB.users.find((user) => user.username === username);

    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            roles: { user: 2001 },
            password: hashedPassword,
        };
        usersDB.setUsers([...usersDB.users, newUser]);

        await fs.promises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        );

        console.log(usersDB.users);
        return res
            .status(201)
            .json({ success: `New user ${username} created!` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleNewUser };
