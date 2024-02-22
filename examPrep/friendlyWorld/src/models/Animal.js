const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "'Name' is required!"],
        minLength: [2, "'Name' should be at least 2 characters long!"]
    },
    years: {
        type: Number,
        min: [1, "Years age must be between 1 and 100!"],
        max: [100, "Years age must be between 1 and 100!"]
    },
    kind: {
        type: String,
        required: [true, "'Kind' is required!"],
        minLength: [3, "'Kind' should be at least 3 characters long!"]
    },
    image: {
        type: String,
        required: [true, "Image URL is required"],
        match: [/^https?:\/\//, "Image URL should start with 'http://' or 'https://'"]
    },
    need: {
        type: String,
        required: [true, "'Need' is required!"],
        minLength: [3, "'Need' should be at least 3 characters long!"],
        maxLength: [20, "'Need' should be no longer than 20 characters!"]
    },
    location: {
        type: String,
        required: [true, "'Location' is required!"],
        minLength: [5, "'Location' should be at least 5 characters long!"],
        maxLength: [15, "'Location' should be no longer than 15 characters!"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [5, "'Description' should be between 5 and 50 characters!"],
        maxLength: [50, "'Description' should be between 5 and 50 characters!"]
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    donations: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

animalSchema.pre("validate", async function () {
    if (typeof this.years !== "number") {
        throw new Error("'Years' must be a number!")
    }
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;