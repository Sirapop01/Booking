const mongoose = require("mongoose");

const SportCategorySchema = new mongoose.Schema({
  arenaId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true },
  sportName: { type: String, required: true },
  iconUrl: { type: String, required: true },
  description: { type: String, default: "" }
});

module.exports = mongoose.model("SportsCategory", SportCategorySchema);
