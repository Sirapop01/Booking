const mongoose = require("mongoose");

const historyBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true },
  sportName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "completed" }
}, { timestamps: true });

const HistoryBooking = mongoose.model("HistoryBooking", historyBookingSchema);

module.exports = HistoryBooking;
