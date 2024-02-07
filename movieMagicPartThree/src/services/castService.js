const Cast = require("../models/Cast");
const Movie = require("../models/Movie");

function create(data) {
    return Cast.create(data);
}

function getAll(movieId) {
    const casts = Cast.find({});
    return casts;
}

function attachActor(movieId, castId) {
    return Movie.findByIdAndUpdate(movieId,{ $push: {cast: castId} });
}

function attachMovie(castId, movieId) {
    return Cast.findByIdAndUpdate(castId,{ $push: {movie: movieId} });
}

module.exports = {
    create,
    getAll,
    attachActor,
    attachMovie
}