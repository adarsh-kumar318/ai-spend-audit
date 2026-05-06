const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    company: String,
    role: String,
    teamSize: Number
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
