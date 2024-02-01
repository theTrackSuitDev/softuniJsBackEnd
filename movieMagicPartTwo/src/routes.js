const express = require("express");
const router = express.Router();

const basicViews = require("./controllers/basicViews");
const movieViews = require("./controllers/movieViews");
const castViews = require("./controllers/castViews");

router.use(movieViews);
router.use(castViews);
router.use(basicViews);

module.exports = router;