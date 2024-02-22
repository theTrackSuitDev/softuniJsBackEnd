const express = require("express");
const mongoose = require("mongoose");
const mainController = express.Router();
const itemService = require("../services/itemService");

mainController.route("/").get(async (req, res) => {
    try {
        const items = await itemService.getLastThree().lean();
        // if (req.user) {
        //     items.forEach(item => {
        //         item.validUser = true;
        //     });
        // }

        res.render("home", { items: items });
    } catch (error) {
        let message = error.message;
        if (error instanceof mongoose.MongooseError) {
            message = Object.values(error.errors).at(0).message;
        }

        console.log(message);
        res.render("404", { message });
    }
});

mainController.route("/catalog").get(async (req, res) => {
    try {
        const items = await itemService.getAll().lean();
        // if (req.user) {
        //     items.forEach(item => {
        //         item.validUser = true;
        //     });
        // }

        res.render("catalog", { items: items });
    } catch (error) {
        let message = error.message;
        if (error instanceof mongoose.MongooseError) {
            message = Object.values(error.errors).at(0).message;
        }

        console.log(message);
        res.render("404", { message });
    }
});

mainController.route("*").get((req, res) => {
    res.render("404");
});

module.exports = mainController;
