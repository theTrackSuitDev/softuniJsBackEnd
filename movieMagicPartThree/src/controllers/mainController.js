const express = require("express");
const mainController = express.Router();
const movieService = require("../services/movieService");

mainController.route("/").get(async (req, res) => {
    try {
        const movies = await movieService.getAll().lean();
        if (req.user) {
            movies.forEach(movie => {
                movie.validUser = true;
            });
        }

        res.render("home", { movies });
    } catch (error) {
        console.log("Database error");
        console.log(error.message);
        res.redirect("/db-error");
    }
});

mainController.route("/about").get((req, res) => {
    res.render("about");
});

mainController.route("/db-error").get((req, res) => {
    res.render("database-error");
});

mainController.route("*").get((req, res) => {
    res.render("404");
});

module.exports = mainController;
