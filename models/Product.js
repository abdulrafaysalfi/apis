const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("products", ProductSchema);
