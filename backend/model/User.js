// User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
module.exports = mongoose.model("User", userSchema);
