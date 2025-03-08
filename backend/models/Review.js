const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    stadiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arena", // อ้างอิงไปที่สนามกีฬา
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessOwner", // อ้างอิงไปที่เจ้าของสนาม
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // อ้างอิงไปที่ผู้ใช้ที่รีวิว
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 }, // คะแนน (1-5)
    comment: { type: String, required: true }, // คอมเมนต์จากลูกค้า
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
