const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
default:"user",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);
