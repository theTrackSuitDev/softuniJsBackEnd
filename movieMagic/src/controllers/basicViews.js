const express = require("express");
const basicViews = express.Router();
const movieService = require("../services/movieService");

basicViews.route("/")
    .get((req, res) => {
        const movies = movieService.getAll();
        res.render("home", { movies });
    });

basicViews.route("/about")
    .get((req, res) => {
        res.render("about");
    });

basicViews.route("*")
    .get((req, res) => {
        res.render("404")
    });

module.exports = basicViews;