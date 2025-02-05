const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blacklist", BlacklistSchema);
