const express = require("express");
const basicViews = express.Router();
const movieService = require("../services/movieService");

basicViews.route("/").get(async (req, res) => {
    try {
        const movies = await movieService.getAll().lean();
        res.render("home", { movies });
    } catch (error) {
        console.log("Database error");
        console.log(error.message);
        res.redirect(`/db-error`);
    }
});

basicViews.route("/about").get((req, res) => {
    res.render("about");
});

basicViews.route("/db-error").get((req, res) => {
    res.render("database-error");
});

basicViews.route("*").get((req, res) => {
    res.render("404");
});

module.exports = basicViews;
