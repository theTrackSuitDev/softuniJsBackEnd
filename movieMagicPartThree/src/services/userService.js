const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt");

const secret = "sad7as7fddf7dgsdfgfg8f6sd4f6s8d4f4dd";

async function register(newUserData) {
    let { email, password, rePassword } = newUserData;

    if (password !== rePassword) {
        throw new Error("Password/email doesn't match!")
    }

    try {
        password = await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error(error)
    }

    return User.create({ email, password });
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

    const payload = {
        _id: user._id,
        email: user.email
    }

    const token = await jwt.sign(payload, secret, { expiresIn: "30m" })

    return token;
}


module.exports = {
    register,
    login,
    secret
}