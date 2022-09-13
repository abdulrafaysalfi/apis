const express = require("express");
const cors = require("cors");
const IndexRoutes = require("../routes/IndexRoutes");
const UserRoutes = require("../routes/UsersRoutes");
const ProductRoutes = require("../routes/ProductRoutes");
module.exports = function (app) {
    require('dotenv').config();
    app.use(express.json());
    app.use(cors());
    app.use(express.static("images"));
    app.use("/images", express.static("images"));
    app.use("/", IndexRoutes);
    app.use("/api/users", UserRoutes);
    app.use("/api/products", ProductRoutes);
}