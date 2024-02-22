const Animal = require("../models/Animal");

function create(data) {
    return Animal.create(data);
}

function getAll() {
        const items = Animal.find({});
        return items;
}

function getLastThree() {
    const lastThree = Animal.find().sort({ created_at: -1 }).limit(3);
    return lastThree;
}

function getById(id) {
    let currentItem = Animal.findOne({ _id: id }).populate('donations').populate('owner');
    return currentItem;
}

function edit(itemId, itemData) {
    return Animal.findByIdAndUpdate(itemId, itemData, { runValidators: true });
}

function getCreatedByUser(userId) {
    const created = Animal.find({ owner: userId });
    return created;
}

function getSignedByUser(userId) {
    const signed = Animal.find({ signUpList: userId });
    return signed;
}

function deleteItem(itemId) {
    return Animal.findByIdAndDelete(itemId);
}

function search(location) {
    let result = {};

    if (location) {
        result.location = new RegExp(location, 'i');
    }

    // if (type) {
    //     result.type = new RegExp(type, 'i');
    // }

    // if (year) {
    //     result.year = year;
    // }

    return Animal.find(result);
}

module.exports = {
    create,
    getAll,
    getLastThree,
    getById,
    edit,
    getCreatedByUser,
    getSignedByUser,
    deleteItem,
    search
}
