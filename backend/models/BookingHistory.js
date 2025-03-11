const mongoose = require("mongoose");

const BookingHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true, // ✅ ป้องกัน session ซ้ำ
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stadiumId: { // ✅ เพิ่ม stadiumId ที่ระดับบนของ schema
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true, // ✅ ใช้สำหรับล้างข้อมูลเมื่อหมดอายุ
    },
    details: [
      {
        subStadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "SubStadium", required: true },
        sportName: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true },
        pricePerHour: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const BookingHistory = mongoose.model("BookingHistory", BookingHistorySchema);
module.exports = BookingHistory;
