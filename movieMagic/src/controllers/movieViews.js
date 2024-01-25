const express = require("express");
const movieViews = express.Router();
const movieService = require("../services/movieService");

movieViews
    .route("/create")
    .get((req, res) => {
        res.render("create");
    })
    .post((req, res) => {
        const movieData = req.body;
        movieService.create(movieData);
        res.redirect("/");
    });

movieViews.route("/details/:movieId").get((req, res) => {
    const movieId = req.params.movieId;
    const movie = movieService.getById(movieId);

    let starArray = [];
    for (let i = 0; i < Number(movie.rating); i++) {
        starArray.push("*");
    }

    movie.rating = starArray;

    res.render("details", { movie });
});

movieViews
    .route("/search")
    .get((req, res) => {
        let searchResults = movieService.getAll();
        res.render("search", { searchResults });
    })
    .post((req, res) => {
        const { title, genre, year } = req.body;
        let searchResults = movieService.search(title, genre, year);

        res.render("search", { searchResults });
    });

module.exports = movieViews;