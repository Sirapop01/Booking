const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  workingHours: { type: String, required: true },
  location: { type: String, required: true },
  amenities: { type: [String], default: [] }, 
  additionalInfo: { type: String },
  images: { type: [String], default: [] },
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessOwner", required: true }, // 🔗 FK ไปที่ BusinessOwner
}, { timestamps: true });

module.exports = mongoose.model("Arena", ArenaSchema);
