const express = require("express");
const movieController = express.Router();
const movieService = require("../services/movieService");

movieController.route("/create")
    .get((req, res) => {
        if (!req.user) {
            return res.redirect("/");
        }

        res.render("create");
    })
    .post(async (req, res) => {
        if (!req.user) {
            return res.redirect("/");
        }

        const movieData = req.body;
        movieData.owner = req.user._id;
        try {
            await movieService.create(movieData);
            res.redirect("/");
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
    });

movieController.route("/details/:movieId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/");
        }

        const movieId = req.params.movieId;
        try {
            const movie = await movieService.getById(movieId).lean();

            let starArray = [];
            for (let i = 0; i < Number(movie.rating); i++) {
                starArray.push("*");
            }

            movie.rating = starArray;
            const isOwner = req.user._id == movie.owner;

            res.render("details", { movie, isOwner });
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
});

movieController.route("/edit/:movieId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/");
        }

        const movieId = req.params.movieId;
        try {
            const movie = await movieService.getById(movieId).lean();
            const isOwner = req.user._id == movie.owner;

            if (!isOwner) {
                return res.redirect("/");
            }

            res.render("edit", { movie });
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect("/db-error");
        }
    })
    .post(async (req, res) => {
        if (!req.user) {
            return res.redirect("/");
        }
    
        const movieId = req.params.movieId;
        const movieData = req.body;
        movieData.owner = req.user._id;

        try {
            const movie = await movieService.getById(movieId).lean();
            const isOwner = req.user._id == movie.owner;

            if (!isOwner) {
                return res.redirect("/");
            }

            await movieService.edit(movieId, movieData);
            res.redirect(`/details/${movieId}`);
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect("/db-error");
        }
    });

movieController.get("/delete/:movieId", async (req, res) => {
    if (!req.user) {
        return res.redirect("/");
    }

    const movieId = req.params.movieId;
    const movieData = req.body;
    movieData.owner = req.user._id;

    try {
        const movie = await movieService.getById(movieId).lean();
        const isOwner = req.user._id == movie.owner;

        if (!isOwner) {
            return res.redirect("/");
        }
        
        await movieService.deleteMovie(movieId);
        res.redirect("/");
    } catch (error) {
        console.log("Database error");
        console.log(error.message);
        res.redirect("/db-error");
    }
});

movieController.route("/search")
    .get(async(req, res) => {
        let searchResults = await movieService.getAll().lean();
        res.render("search", { searchResults });
    })
    .post(async(req, res) => {
        const { title, genre, year } = req.body;
        try {
            let searchResults =  await movieService.search(title, genre, year).lean();
            res.render("search", { searchResults });
        } catch (error) {
            console.log("Database error");
            console.log(error.message);
            res.redirect(`/db-error`);
        }
    });

module.exports = movieController;