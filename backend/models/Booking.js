const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
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
    subStadiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubStadium",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeRange: {
      type: String,
      required: true, // เช่น "10:00 - 12:00"
    },
    status: {
      type: String,
      enum: ["confirmed", "canceled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
