const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" }, // ✅ ใช้ GeoJSON
    coordinates: { type: [Number], required: true } // ✅ lat, lng ต้องเป็น Array ของตัวเลข
  },
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  additionalInfo: { type: String, default: "" },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] }
}, { timestamps: true });

// ✅ เพิ่ม Index เพื่อรองรับการค้นหา GeoJSON
ArenaSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Arena", ArenaSchema);
