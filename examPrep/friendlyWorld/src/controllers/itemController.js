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

            let donatorsArray = [];

            const isOwner = req.user?._id == item.owner._id;

            // let haveSignUps = false;
            if (item.donations.length > 0) {
                // haveSignUps = true;
                item.donations.forEach(user => {
                    donatorsArray.push(user.email);
                });
            }

            // let signedList = signedArray.join(", ");

            let userHasDonated = false;
            if (donatorsArray.includes(req.user?.email)) {
                userHasDonated = true;
            }

            res.render("details", { item: item, isOwner, userHasDonated });
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

itemController.route("/donate/:itemId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.redirect("/404");
        }
    
        const itemId = req.params.itemId;
        const userId = req.user._id;

        try {
            const item = await itemService.getById(itemId).lean();
            const isOwner = req.user._id == item.owner._id;

            let donatorsArray = [];

            if (item.donations.length > 0) {
                item.donations.forEach(user => {
                    donatorsArray.push(user.email);
                });
            }

            let userHasDonated = false;
            if (donatorsArray.includes(req.user?.email)) {
                userHasDonated = true;
            }

            if (isOwner || userHasDonated) {
                return res.redirect("/404");
            }

            item.donations.push(userId);

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

itemController.route("/search")
    .get(async(req, res) => {
        let items = await itemService.getAll().lean();
        res.render("search", { items });
    })
    .post(async(req, res) => {
        const { location } = req.body;
        try {
            let items =  await itemService.search(location).lean();
            res.render("search", { items, location  });
        } catch (error) {
            let message = error.message;
            if (error instanceof mongoose.MongooseError) {
                message = Object.values(error.errors).at(0).message;
            }
    
            console.log(message);
            res.render("404", { message });
        }
    });

module.exports = itemController;