const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("token", TokenSchema);
