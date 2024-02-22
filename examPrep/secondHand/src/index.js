const express = require("express");
const mongoose = require("mongoose");

const expressConfig = require("./config/expressConfig");
const hbsConfig = require("./config/hbsConfig");

const router = require("./routes");

const app = express();
const port = 3000;

expressConfig(app);
hbsConfig(app);

app.use(router);

const connectionString = "mongodb://localhost:27017/secondHand";
mongoose.connect(connectionString)
    .then(() => {
        console.log("Connection to Database successful.")

        app.listen(port, console.log(`Server is listening on port ${port}...`));
    })
    .catch((error) => {
        let message = error.message;
        if (error instanceof mongoose.MongooseError) {
            message = Object.values(error.errors).at(0).message;
        }

        console.log(message);
        res.render("404", { message });
    });