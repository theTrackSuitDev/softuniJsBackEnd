const express = require("express");
const uniqid = require("uniqid");
const movies = require("../data/movies.json");
const path = require("path");
const fs = require("fs/promises");

async function create(data) {
    data._id = uniqid();   
    movies.push(data);
    
    try {
        await fs.writeFile(path.resolve("src/data/movies.json"), JSON.stringify(movies));
    } catch (error) {
        throw new Error(`Unable to add movie: ${error}`);
    }

}

function getAll() {
    return movies.slice();
}

function getById(id) {
    let currentMovie = movies.find(movie => movie._id === id);
    let result = {...currentMovie};
    return result;
}

function search(title, genre, year) {
    let result = [];

    if (title) {
        result = movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
    }

    if (genre) {
        result = movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    }

    if (year) {
        result = movies.filter(movie => movie.year === year);
    }

    return result;
}

module.exports = {
    create,
    getAll,
    getById,
    search
}
