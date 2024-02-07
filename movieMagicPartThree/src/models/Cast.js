const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 75
    },
    born: {
        type: String,
        required: true
    },
    movieName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        match: /^https?:\/\//
    },
    movie: [{
        type: mongoose.Types.ObjectId,
        ref: "Movie"
    }]

});

const Cast = mongoose.model("Cast", castSchema);

module.exports = Cast;