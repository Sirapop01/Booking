const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ผู้ใช้ที่ชำระเงิน
    sessionId: { type: String, required: true, unique: true }, // รหัสอ้างอิงการจอง
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingHistory", required: true }, // อ้างอิงคำสั่งจอง
    stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true }, // ✅ อ้างอิงไปยัง Arena model

    amount: { type: Number, required: true }, // จำนวนเงินที่โอน
    transferTime: { type: String, required: true }, // เวลาที่โอนเงิน
    slipImage: { type: String, required: true }, // URL หลักฐานการโอนจาก Cloudinary

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "paid"],
      default: "paid",
    }, // สถานะของการชำระเงิน

    rejectionReason: { type: String, default: null }, // ✅ เพิ่มช่องเก็บเหตุผลการปฏิเสธ

    details: [
      {
        subStadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "SubStadium" },
        sportName: { type: String },
        bookingDate: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
        duration: { type: Number },
        pricePerHour: { type: Number },
        price: { type: Number },
      },
    ],

    createdAt: { type: Date, default: Date.now }, // เวลาที่สร้างเอกสาร
    updatedAt: { type: Date, default: Date.now }, // เวลาที่อัปเดตรายการ
  },
  { collection: "payments" }
);

module.exports = mongoose.model("Payment", PaymentSchema);
