const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  vipLevel: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);
