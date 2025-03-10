const mongoose = require("mongoose");

const BookingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stadiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arena",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessOwner",
      required: true,
    },
    sportName: { type: String, required: true }, // ✅ เพิ่มประเภทกีฬา (Football, Basketball ฯลฯ)
    timeRange: { type: String, required: true }, // ✅ เพิ่มช่วงเวลาที่จอง (เช่น "10:00 - 12:00")
    bookingDate: { type: Date, required: true },
    status: { type: String, enum: ["completed", "canceled", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const BookingHistory = mongoose.model("BookingHistory", BookingHistorySchema);
module.exports = BookingHistory;
