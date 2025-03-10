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
    subStadiumId: {  // ✅ เพิ่ม ID ของสนามย่อย
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubStadium",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessOwner",
      required: true,
    },
    sportName: { type: String, required: true }, // ประเภทกีฬา (Football, Basketball ฯลฯ)
    timeSlots: { type: [String], required: true }, // ✅ เปลี่ยนจาก timeRange เป็น Array
    bookingDate: { type: Date, required: true },
    status: { type: String, enum: ["completed", "canceled"], default: "completed" },
  },
  { timestamps: true }
);

const BookingHistory = mongoose.model("BookingHistory", BookingHistorySchema);
module.exports = BookingHistory;
