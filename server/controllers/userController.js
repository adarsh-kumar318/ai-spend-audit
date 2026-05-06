const User = require('../models/User');

const createUser = async (req, res) => {
    try {
        const { email, company, role, teamSize } = req.body;

        const user = new User({
            email,
            company,
            role,
            teamSize
        });

        await user.save();

        res.status(201).json({ message: "User saved successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createUser };
