const express = require("express");
const router = express.Router();

const basicViews = require("./controllers/basicViews");
const movieViews = require("./controllers/movieViews");

router.use(movieViews);
router.use(basicViews);

module.exports = router;