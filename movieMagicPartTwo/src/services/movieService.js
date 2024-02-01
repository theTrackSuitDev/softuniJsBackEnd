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
    search
}
