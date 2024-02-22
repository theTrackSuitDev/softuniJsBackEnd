const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "'Title' is required!"],
        minLength: [5, "'Title' should be at least 5 characters long!"]
    },
    type: {
        type: String,
        required: [true, "'Type' is required!"],
        minLength: [3, "'Type' should be at least 3 characters long!"]
    },
    certificate: {
        type: String,
        required: [true, "'Certificate' is required!"],
        minLength: [2, "'Certificate' should be at least 2 characters long!"]
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        match: [/^https?:\/\//, "Image URL should start with 'http://' or 'https://'"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [10, "'Description' should be at least 10 characters long!"]
    },
    price: {
        type: Number,
        required: [true, "'Price' is required!"],
        min: [1, "Price must be a positive number!"]
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    signUpList: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;