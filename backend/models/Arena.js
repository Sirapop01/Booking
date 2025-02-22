const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema(
  {
    fieldName: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    businessOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessOwner",
      required: true,
    },
    additionalInfo: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    open: { type: Boolean, default: true }, // ✅ เพิ่มสถานะเปิด/ปิด
    status: { type: String, default: "พร้อมใช้งาน" }, // ✅ เพิ่มสถานะของสนามกีฬา
  },
  { timestamps: true }
);

// ✅ สำคัญ! เพิ่ม Index เพื่อรองรับ GeoJSON
ArenaSchema.index({ location: "2dsphere" });

const Arena = mongoose.model("Arena", ArenaSchema);
module.exports = Arena;
