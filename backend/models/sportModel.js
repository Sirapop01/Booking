const mongoose = require("mongoose");

const SportSchema = new mongoose.Schema({
  arenaId: { type: mongoose.Schema.Types.ObjectId, ref: "arenas", required: true }, 
  sportName: { type: String, required: true },
  iconUrl: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Sport = mongoose.model("sportsCategories", SportSchema);
module.exports = Sport;
