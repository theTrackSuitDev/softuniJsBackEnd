const express = require("express");
const mongoose = require("mongoose");
const userController = express.Router();
const userService = require("../services/userService");
const itemService = require("../services/itemService");

userController.route("/register")
    .get((req, res) => {
        if (req.user) {
            return res.redirect("/404");
        }

        res.render("register");
    })
    .post(async (req, res) => {
        if (req.user) {
            return res.redirect("/404");
        }

        const newUserData = req.body;
        try {
            const token = await userService.register(newUserData);
            res.cookie("auth", token);
            res.redirect("/");
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("register", { ...newUserData, message });
        }
        
    });

userController.route("/login")
    .get((req, res) => {
        if (req.user) {
            return res.redirect("/404");
        }

        res.render("login");
    })
    .post(async (req, res) => {
        if (req.user) {
            return res.redirect("/404");
        }

        const loginData = req.body;
        try {
            const token = await userService.login(loginData);
            res.cookie("auth", token);
            res.redirect("/");
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("login", { ...loginData, message });
        }
        
    });

userController.route("/profile").get(async (req, res) => {
    if (!req.user) {
        return res.redirect("/404");
    }

    // const email = req.user.email;
    try {
        const created = await itemService.getCreatedByUser(req.user._id).lean();
        // const signed = await itemService.getSignedByUser(req.user._id).lean();
        res.render("profile", { created });

    } catch (error) {
        let message = error.message;
        if (error instanceof mongoose.MongooseError) {
            message = Object.values(error.errors).at(0).message;
        }

        console.log(message);
        res.render("404", { message });
    }

});

userController.get("/logout", (req, res) => {
    if (!req.user) {
        return res.redirect("/404");
    }

    res.clearCookie("auth");
    res.redirect("/");
});

module.exports = userController; 