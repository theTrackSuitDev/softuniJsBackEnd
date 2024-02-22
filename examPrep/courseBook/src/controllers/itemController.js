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
            res.redirect("/");
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

            let signedArray = [];

            const isOwner = req.user?._id == item.owner._id;

            let haveSignUps = false;
            if (item.signUpList.length > 0) {
                haveSignUps = true;
                item.signUpList.forEach(user => {
                    signedArray.push(user.username);
                });
            }

            let signedList = signedArray.join(", ");

            let userIsSigned = false;
            if (signedArray.includes(req.user?.username)) {
                userIsSigned = true;
            }

            res.render("details", { item: item, isOwner, haveSignUps, userIsSigned, signedList });
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

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
    const itemData = req.body;
    itemData.owner = req.user._id;

    try {
        const movie = await itemService.getById(itemId).lean();
        const isOwner = req.user._id == movie.owner._id;

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

itemController.route("/signUp/:itemId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }
    
        const itemId = req.params.itemId;
        const userId = req.user._id;

        try {
            const item = await itemService.getById(itemId).lean();
            const isOwner = req.user._id == item.owner._id;

            if (isOwner) {
                return res.redirect("/404");
            }

            item.signUpList.push(userId);

            await itemService.edit(itemId, item);
            res.redirect(`/details/${itemId}`);
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }

            console.log(message);
            res.status(400).render("404", { message });
        }
    });

// itemController.route("/search")
//     .get(async(req, res) => {
//         let searchResults = await itemService.getAll().lean();
//         res.render("search", { searchResults });
//     })
//     .post(async(req, res) => {
//         const { title, genre, year } = req.body;
//         try {
//             let searchResults =  await itemService.search(title, genre, year).lean();
//             res.render("search", { searchResults });
//         } catch (error) {
//             let message = error.message;
//             if (error instanceof mongoose.MongooseError) {
//                 message = Object.values(error.errors).at(0).message;
//             }

//             console.log(message);
//             res.status(400).render("/", { message });
//         }
//     });

module.exports = itemController;