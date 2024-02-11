const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "'Title' is required!"],
        minLength: [5, "'Title' should be at least 5 characters long!"],
        match: [/^[a-zA-Z0-9\s]+$/, "'Title' can include only english letters, digits and white spaces!"]
    },
    genre: {
        type: String,
        required: [true, "'Genre' is required!"],
        minLength: [5, "'Genre' should be at least 5 characters long!"],
        match: [/^[a-zA-Z0-9\s]+$/, "'Genre' can include only english letters, digits and white spaces!"]
    },
    director: {
        type: String,
        required: [true, "'Director' is required!"],
        minLength: [5, "'Director' should be at least 5 characters long!"],
        match: [/^[a-zA-Z0-9\s]+$/, "'Director' can include only english letters, digits and white spaces!"]
    },
    year: {
        type: Number,
        required: [true, "'Year' is required!"],
        min: [1900, "Year must be between 1900 and 2024!"],
        max: [2024, "Year must be between 1900 and 2024!"]
    },
    imageUrl: {
        type: String,
        required: [true, "Poster URL is required"],
        match: [/^https?:\/\//, "Poster URL should start with 'http://' or 'https://'"]
    },
    rating: {
        type: Number,
        required: [true, "'Rating' is required!"],
        min: [1, "Rating must be between 1 and 5!"],
        max: [5, "Rating must be between 1 and 5!"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [20, "'Description' should be at least 20 characters long!"],
        match: [/^[a-zA-Z0-9\s\.\,]+$/, "'Description' can include only english letters, digits and white spaces!"]
    },
    cast: [{
        type: mongoose.Types.ObjectId,
        ref: "Cast"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;