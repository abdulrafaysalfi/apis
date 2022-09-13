const mongoose = require("mongoose");
require("dotenv").config();
module.exports = function () {
    mongoose.connect(process.env.DB_CONNECT, (err, result) => {
        if (err) {
            console.log("Connection Failed.");
            console.log(err);
        } else {
            console.log("Database Connection Successful.");
        }
    });
}