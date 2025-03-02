const mongoose = require("mongoose");

const subStadiumSchema = new mongoose.Schema({
  arenaId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true }, // เชื่อมกับสนามหลัก
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: "sportModel", required: true }, // เชื่อมกับประเภทกีฬา
  name: { type: String, required: true },
  description: { type: String },
  intendant: { type: String, required: true },
  phone: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, enum: ["เปิด", "ปิดชั่วคราว"], default: "เปิด" },
  images: [{ type: String }], // เก็บ URL ของภาพที่อัปโหลดไป Cloudinary
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessOwner", required: true }, // ✅ เพิ่ม owner_id
});

module.exports = mongoose.model("SubStadium", subStadiumSchema);
