const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessOwner", required: true }, // เจ้าของธุรกิจ
  stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true }, // อ้างอิงถึงสนามกีฬา
  promotionTitle: { type: String, required: true }, // หัวข้อโปรโมชั่น
  description: { type: String }, // รายละเอียด
  discount: { type: Number, required: true, min: 0 }, // ส่วนลด %
  startDate: { type: Date, required: true }, // วันที่เริ่ม
  endDate: { type: Date, required: true }, // วันที่สิ้นสุด
  timeRange: { type: String, required: true }, // ช่วงเวลาโปรโมชั่น
  promotionImageUrl: { type: String, required: true }, // URL ของรูปภาพ
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" }, // สถานะ
  createdAt: { type: Date, default: Date.now }, // เวลาสร้าง
});

module.exports = mongoose.model("Promotion", PromotionSchema);
