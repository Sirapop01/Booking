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
    bookingDate: { type: Date, required: true },
    status: { type: String, enum: ["completed", "canceled"], default: "completed" },
  },
  { timestamps: true }
);

const BookingHistory = mongoose.model("BookingHistory", BookingHistorySchema);
module.exports = BookingHistory;
