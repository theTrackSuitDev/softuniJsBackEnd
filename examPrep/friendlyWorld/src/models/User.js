const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required!"],
        // lowercase: [true, "Email should contain only lowercase letters!"],
        // unique: true,
        // match: [/.*@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, "Email should end in @x.x, where x is one or more English letters/digits!"],
        minLength: [10, "Email should be at least 10 characters long!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        // match: [/^[a-zA-Z0-9]+$/, "Password should contain only english letters and digits!"],
        minLength: [4, "Password should be at least 4 characters long!"]
    }
});

userSchema.virtual("rePassword").set(function (value) {
    if (value !== this.password) {
        throw new Error("Password doesn't match!")
    }
});

userSchema.pre("save", async function () {
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw new Error(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;