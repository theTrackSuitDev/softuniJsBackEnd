const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { userCheck } = require("../middlewares/auth");

function expressConfig(app) {
    app.use(express.static(path.resolve("src/static")));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(userCheck);

    return app;
}

module.exports = expressConfig;

