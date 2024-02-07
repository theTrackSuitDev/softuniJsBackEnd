const express = require("express");
const router = express.Router();

const mainController = require("./controllers/mainController");
const movieController = require("./controllers/movieController");
const castController = require("./controllers/castController");
const userController = require("./controllers/userController");

router.use(movieController);
router.use(castController);
router.use(userController);
router.use(mainController);

module.exports = router;