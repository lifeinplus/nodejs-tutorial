const bcrypt = require("bcrypt");
const User = require("../model/User");

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    const duplicate = await User.findOne({ username }).exec();

    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            username,
            password: hashedPassword,
        });

        console.log(result);

        return res
            .status(201)
            .json({ success: `New user ${username} created!` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { handleNewUser };
