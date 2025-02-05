const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  workingHours: { type: String, required: true },
  location: { type: [Number], required: true }, // ✅ เปลี่ยนจาก String → Array ของ Number
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  additionalInfo: { type: String },
  amenities: { type: [String] },
  images: { type: [String] },
});

module.exports = mongoose.model("Arena", ArenaSchema);
