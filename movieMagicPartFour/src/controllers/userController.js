const express = require("express");
const mongoose = require("mongoose");
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
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("login", { ...loginData, message });
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