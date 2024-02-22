const Course = require("../models/Course");

function create(data) {
    return Course.create(data);
}

function getAll() {
        const items = Course.find({});
        return items;
}

function getLastThree() {
    const lastThree = Course.find().sort({ created_at: -1 }).limit(3);
    return lastThree;
}

function getById(id) {
    let currentItem = Course.findOne({ _id: id }).populate('signUpList').populate('owner');
    return currentItem;
}

function edit(itemId, itemData) {
    return Course.findByIdAndUpdate(itemId, itemData, { runValidators: true });
}

function getCreatedByUser(userId) {
    const created = Course.find({ owner: userId });
    return created;
}

function getSignedByUser(userId) {
    const signed = Course.find({ signUpList: userId });
    return signed;
}

function deleteItem(itemId) {
    return Course.findByIdAndDelete(itemId);
}

// function search(title, genre, year) {
//     let result = {};

//     if (title) {
//         result.title = new RegExp(title, 'i');
//     }

//     if (genre) {
//         result.genre = new RegExp(genre, 'i');
//     }

//     if (year) {
//         result.year = year;
//     }

//     return Course.find(result);
// }

module.exports = {
    create,
    getAll,
    getLastThree,
    getById,
    edit,
    getCreatedByUser,
    getSignedByUser,
    deleteItem
    // search
}
