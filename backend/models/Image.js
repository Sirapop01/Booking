const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Image", ImageSchema);
