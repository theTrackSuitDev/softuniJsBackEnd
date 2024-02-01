const express = require("express");
const castViews = express.Router();
const castService = require("../services/castService");
const movieService = require("../services/movieService");

castViews.route("/cast/create")
    .get((req, res) => {
        res.render("cast-create");
    })
    .post(async (req, res) => {
        const castData = req.body;
        try {
            await castService.create(castData);
            res.redirect("/");
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
    });

castViews.route("/cast/:movieId")
    .get(async (req, res) => {
        const movieId = req.params.movieId;
        let movie;
        let casts;

        try {
            movie = await movieService.getById(movieId).lean();
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }

        try {
            casts = await castService.getAll().lean();
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
        
        res.render("cast-attach", { movieId, movie, casts });
    })
    .post(async (req, res) => {
        const movieId = req.params.movieId;
        const castId = req.body.cast;
        try {
            await castService.attachActor(movieId, castId);
            await castService.attachMovie(castId, movieId);
            res.redirect(`/details/${movieId}`);
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);

        }
    });

module.exports = castViews;
