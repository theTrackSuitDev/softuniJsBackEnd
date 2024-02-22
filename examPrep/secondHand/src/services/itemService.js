const Electronic = require("../models/Electronic");

function create(data) {
    return Electronic.create(data);
}

function getAll() {
        const items = Electronic.find({});
        return items;
}

function getLastThree() {
    const lastThree = Electronic.find().sort({ created_at: -1 }).limit(3);
    return lastThree;
}

function getById(id) {
    let currentItem = Electronic.findOne({ _id: id }).populate('buyingList').populate('owner');
    return currentItem;
}

function edit(itemId, itemData) {
    return Electronic.findByIdAndUpdate(itemId, itemData, { runValidators: true });
}

function getCreatedByUser(userId) {
    const created = Electronic.find({ owner: userId });
    return created;
}

function getSignedByUser(userId) {
    const signed = Electronic.find({ signUpList: userId });
    return signed;
}

function deleteItem(itemId) {
    return Electronic.findByIdAndDelete(itemId);
}

function search(name, type) {
    let result = {};

    if (name) {
        result.name = new RegExp(name, 'i');
    }

    if (type) {
        result.type = new RegExp(type, 'i');
    }

    // if (year) {
    //     result.year = year;
    // }

    return Electronic.find(result);
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
