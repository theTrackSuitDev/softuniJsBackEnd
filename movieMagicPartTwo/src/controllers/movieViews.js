const express = require("express");
const movieViews = express.Router();
const movieService = require("../services/movieService");

movieViews
    .route("/create")
    .get((req, res) => {
        res.render("create");
    })
    .post(async (req, res) => {
        const movieData = req.body;
        try {
            await movieService.create(movieData);
            res.redirect("/");
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
    });

movieViews.route("/details/:movieId")
    .get(async (req, res) => {
        const movieId = req.params.movieId;
        try {
            const movie = await movieService.getById(movieId).lean();

            let starArray = [];
            for (let i = 0; i < Number(movie.rating); i++) {
                starArray.push("*");
            }

            movie.rating = starArray;

            res.render("details", { movie });
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
});

movieViews
    .route("/search")
    .get(async(req, res) => {
        let searchResults = await movieService.getAll().lean();
        res.render("search", { searchResults });
    })
    .post(async(req, res) => {
        const { title, genre, year } = req.body;
        try {
            let searchResults =  await movieService.search(title, genre, year).lean();
            console.log(searchResults);
            res.render("search", { searchResults });
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
    });

module.exports = movieViews;
