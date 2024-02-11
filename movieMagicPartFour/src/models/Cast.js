const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "'Name' is required!"],
        minLength: [5, "'Name' should be at least 5 characters long!"],
        match: [/^[a-zA-Z0-9\s]+$/, "'Name' can include only english letters, digits and white spaces!"]
    },
    age: {
        type: Number,
        required: [true, "'Age' is required!"],
        min: [1, "Age must be between 1 and 120!"],
        max: [120, "Age must be between 1 and 120!"]
    },
    born: {
        type: String,
        required: [true, "Place of birth is required!"],
        minLength: [10, "'Born' should be at least 10 characters long!"],
        match: [/^[a-zA-Z0-9\s\,]+$/, "Place of birth can include only english letters, digits and white spaces!"]
    },
    movieName: {
        type: String,
        required: [true, "Character name is required!"],
        minLength: [5, "Character name should be at least 5 characters long!"],
        match: [/^[a-zA-Z0-9\s]+$/, "Character name can include only english letters, digits and white spaces!"]
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        match: [/^https?:\/\//, "Image URL should start with 'http://' or 'https://'"]
    },
    movie: [{
        type: mongoose.Types.ObjectId,
        ref: "Movie"
    }]

});

const Cast = mongoose.model("Cast", castSchema);

module.exports = Cast;