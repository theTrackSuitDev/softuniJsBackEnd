const Creature = require("../models/Creature");

function create(data) {
    return Creature.create(data);
}

function getAll() {
        const items = Creature.find({});
        return items;
}

function getLastThree() {
    const lastThree = Creature.find().sort({ created_at: -1 }).limit(3);
    return lastThree;
}

function getById(id) {
    let currentItem = Creature.findOne({ _id: id }).populate('votes').populate('owner');
    return currentItem;
}

function edit(itemId, itemData) {
    return Creature.findByIdAndUpdate(itemId, itemData, { runValidators: true });
}

function getCreatedByUser(userId) {
    const created = Creature.find({ owner: userId });
    return created;
}

function getSignedByUser(userId) {
    const signed = Creature.find({ signUpList: userId });
    return signed;
}

function deleteItem(itemId) {
    return Creature.findByIdAndDelete(itemId);
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

    return Creature.find(result);
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
