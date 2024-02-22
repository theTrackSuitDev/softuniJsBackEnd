const express = require("express");
const router = express.Router();

const mainController = require("./controllers/mainController");
const itemController = require("./controllers/itemController");
// const castController = require("./controllers/castController");
const userController = require("./controllers/userController");

router.use(itemController);
// router.use(castController);
router.use(userController);
router.use(mainController);

module.exports = router;