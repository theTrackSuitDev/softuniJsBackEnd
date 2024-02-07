const express = require("express");
const userController = express.Router();
const userService = require("../services/userService");

userController.route("/register")
    .get((req, res) => {
        if (req.user) {
            return res.redirect("/");
        }

        res.render("register");
    })
    .post(async (req, res) => {
        if (req.user) {
            return res.redirect("/");
        }

        const newUserData = req.body;
        try {
            await userService.register(newUserData);
            res.redirect("/login");
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            if (error.message === "Password/email doesn't match!") {
                res.render("register", { wrongPass: true });
            } else {
                res.render("database-error", { message: error.message });
            }
        }
        
    });

userController.route("/login")
    .get((req, res) => {
        if (req.user) {
            return res.redirect("/");
        }

        res.render("login");
    })
    .post(async (req, res) => {
        if (req.user) {
            return res.redirect("/");
        }

        const loginData = req.body;
        try {
            const token = await userService.login(loginData);
            res.cookie("auth", token);
            res.redirect("/");
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            if (error.message === "Password/email doesn't match!") {
                res.render("login", { wrongPass: true });
            } else {
                res.render("database-error", { message: error.message });
            }
        }
        
    });

userController.get("/logout", (req, res) => {
    if (!req.user) {
        return res.redirect("/invalidLogout");
    }

    res.clearCookie("auth");
    res.redirect("/");
});

module.exports = userController; 