const mongoose = require("mongoose");

const subStadiumSchema = new mongoose.Schema({
  arenaId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true }, // เชื่อมกับสนามหลัก
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: "sportModel", required: true }, // เชื่อมกับประเภทกีฬา
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: String, required: true },
  phone: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, enum: ["เปิด", "ปิดชั่วคราว"], default: "เปิด" },
  images: [{ type: String }], // เก็บ URL ของภาพที่อัปโหลดไป Cloudinary
});

module.exports = mongoose.model("SubStadium", subStadiumSchema);
