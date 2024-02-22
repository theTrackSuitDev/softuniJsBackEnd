const jwt = require("../lib/jwt");
const { secret } = require("../services/userService");

async function userCheck(req, res, next) {
    const token = req.cookies.auth;

    if (!token) {
        return next();
    }

    try {
        const user = await jwt.verify(token, secret);
        req.user = user;
        res.locals.validUser = true;
        res.locals.loggedUser = user.username;

        next();

    } catch (error) {
        res.clearCookie("auth");
        res.redirect("/login");
    }
}

module.exports = {
   userCheck
}