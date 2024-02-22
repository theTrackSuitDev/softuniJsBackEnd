const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt");

const secret = "sad7as7fddf7dgsdfgfg8f6sd4f6s8d4f4dd";

async function register(newUserData) {
    let { username, email, password, rePassword } = newUserData;

    let user;
    try {
        user = await User.findOne().or([{ email: email }, { username: username }]);
    } catch (error) {
        throw new Error(error);
    }

    if (user) {
        throw new Error("Email/username already exists!");
    }

    // if (!password.match(/^[a-zA-Z0-9]+$/)) {
    //     throw new Error("Password should contain only english letters and digits!");
    // }

    // if (password.length < 4) {
    //     throw new Error("Password should be at least 4 characters long!");
    // }

    // try {
    //     password = await bcrypt.hash(password, 10);
    // } catch (error) {
    //     throw new Error(error);
    // }

    // if (password !== rePassword) {
    //     throw new Error("Password doesn't match!");
    // }

    const createdUser = await User.create({ username, email, password, rePassword });

    const token = await generateToken(createdUser);

    return token;
}

async function login(loginData) {
    let { email, password } = loginData;
    
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error ("Password/email doesn't match!");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
        throw new Error ("Password/email doesn't match!");
    }

    const token = await generateToken(user);

    return token;
}

async function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    }

    const token = await jwt.sign(payload, secret, { expiresIn: "1h" });

    return token;
}

module.exports = {
    register,
    login,
    secret
}