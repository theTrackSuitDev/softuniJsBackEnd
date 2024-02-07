const Movie = require("../models/Movie");

function create(data) {
    return Movie.create(data);
}

function getAll() {
        const movies = Movie.find({});
        return movies;
}

function getById(id) {
    let currentMovie = Movie.findOne({ _id: id }).populate('cast');
    return currentMovie;
}

function edit(movieId, movieData) {
    return Movie.findByIdAndUpdate(movieId, movieData);
}

function deleteMovie(movieId) {
    return Movie.findByIdAndDelete(movieId);
}

function search(title, genre, year) {
    let result = {};

    if (title) {
        result.title = new RegExp(title, 'i');
    }

    if (genre) {
        result.genre = new RegExp(genre, 'i');
    }

    if (year) {
        result.year = year;
    }

    return Movie.find(result);
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteMovie,
    search
}
