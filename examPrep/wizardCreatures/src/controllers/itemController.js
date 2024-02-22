const express = require("express");
const mongoose = require("mongoose");
const itemController = express.Router();
const itemService = require("../services/itemService");

itemController.route("/create")
    .get((req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }

        res.render("create");
    })
    .post(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }

        const itemData = req.body;
        itemData.owner = req.user._id;
        try {
            await itemService.create(itemData);
            res.redirect("/catalog");
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("create", { ...itemData, message });
        }
    });

itemController.route("/details/:itemId")
    .get(async (req, res) => {
        // if (!req.user) {
        //     return res.redirect("/404");
        // }

        const itemId = req.params.itemId;
        try {
            const item = await itemService.getById(itemId).lean();

            let votersArray = [];

            const isOwner = req.user?._id == item.owner._id;

            let hasVotes = false;
            if (item.votes.length > 0) {
                hasVotes = true;
                item.votes.forEach(user => {
                    votersArray.push(user.email);
                });
            }

            let votersList = votersArray.join(", ");

            let userIsVoter = false;
            if (votersArray.includes(req.user?.email)) {
                userIsVoter = true;
            }

            res.render("details", { item: item, isOwner, userIsVoter, hasVotes, votersArray, votersList });
        } catch (error) {
            let message = error.message;
            // if (error instanceof mongoose.MongooseError) {
            //     message = Object.values(error.errors).at(0).message;
            // }

            console.log(message);
            res.render("404", { message });
        }
});

itemController.route("/edit/:itemId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }

        const itemId = req.params.itemId;
        try {
            const item = await itemService.getById(itemId).lean();
            const isOwner = req.user._id == item.owner._id;

            if (!isOwner) {
                return res.redirect("/404");
            }

            res.render("edit", { ...item });
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.render("404", { message });
        }
    })
    .post(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }
    
        const itemId = req.params.itemId;
        const itemData = req.body;
        itemData.owner = req.user._id;

        try {
            const item = await itemService.getById(itemId).lean();
            const isOwner = req.user._id == item.owner._id;

            if (!isOwner) {
                return res.redirect("/404");
            }

            await itemService.edit(itemId, itemData);
            res.redirect(`/details/${itemId}`);
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("edit", { ...itemData, message });
        }
    });

itemController.get("/delete/:itemId", async (req, res) => {
    if (!req.user) {
        return res.redirect("/404");
    }

    const itemId = req.params.itemId;

    try {
        const item = await itemService.getById(itemId).lean();
        const isOwner = req.user._id == item.owner._id;

        if (!isOwner) {
            return res.redirect("/404");
        }
        
        await itemService.deleteItem(itemId);
        res.redirect("/catalog");
    } catch (error) {
        let message = error.message;
        if (error instanceof mongoose.MongooseError) {
            message = Object.values(error.errors).at(0).message;
        }

        console.log(message);
        res.render("404", { message });
    }
});

itemController.route("/vote/:itemId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }
    
        const itemId = req.params.itemId;
        const userId = req.user._id;

        try {
            const item = await itemService.getById(itemId).lean();
            const isOwner = req.user._id == item.owner._id;

            let votersArray = [];

            if (item.votes.length > 0) {
                item.votes.forEach(user => {
                    votersArray.push(user.email);
                });
            }

            let userIsVoter = false;
            if (votersArray.includes(req.user?.email)) {
                userIsVoter = true;
            }

            if (isOwner || userIsVoter) {
                return res.redirect("/404");
            }

            item.votes.push(userId);

            await itemService.edit(itemId, item);
            res.redirect(`/details/${itemId}`);
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }
    
            console.log(message);
            res.render("404", { message });
        }
    });

// itemController.route("/search")
//     .get(async(req, res) => {
//         let results = await itemService.getAll().lean();
//         res.render("search", { results });
//     })
//     .post(async(req, res) => {
//         const { name, type } = req.body;
//         try {
//             let results =  await itemService.search(name, type).lean();
//             res.render("search", { name, type, results  });
//         } catch (error) {
//             let message = error.message;
//             if (error instanceof mongoose.MongooseError) {
//                 message = Object.values(error.errors).at(0).message;
//             }
    
//             console.log(message);
//             res.render("404", { message });
//         }
//     });

module.exports = itemController;