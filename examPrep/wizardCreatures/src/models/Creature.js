const mongoose = require("mongoose");

const creatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "'Name' is required!"],
        minLength: [2, "'Name' should be at least 2 characters long!"]
    },
    species: {
        type: String,
        required: [true, "'Species' is required!"],
        minLength: [3, "'Species' should be at least 3 characters long!"]
    },
    skinColor: {
        type: String,
        required: [true, "Skin color is required"],
        minLength: [3, "Skin color should be at least 3 characters long!"]
    },
    eyeColor: {
        type: String,
        required: [true, "Eye color is required"],
        minLength: [3, "Eye color should be at least 3 characters long!"]
    },
    image: {
        type: String,
        required: [true, "Image URL is required"],
        match: [/^https?:\/\//, "Image URL should start with 'http://' or 'https://'"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [5, "'Description' should be between 5 and 500 characters!"],
        maxLength: [500, "'Description' should be between 5 and 500 characters!"]
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    votes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const Creature = mongoose.model("Creature", creatureSchema);

module.exports = Creature;