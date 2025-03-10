const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import BookingHistory from "../models/BookingHistory";
const Bookings = require("../models/Booking");
const Substadium = require("../models/Substadium");
const BusinessInfo = require("../models/BusinessInfo");


require("dotenv").config();
// ✅ ดึงข้อมูลการจอง + ข้อมูลสนาม + ข้อมูลธนาคาร
exports.getPaymentDetails = async (req, res) => {
    try {
        
        const { bookingId } = req.params;

        // 🔹 ดึงข้อมูลการจองจาก Booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });
        }

        // 🔹 ดึงข้อมูลสนามจาก Substadium
        const substadium = await Substadium.findById(booking.substadiumId);
        if (!substadium) {
            return res.status(404).json({ message: "ไม่พบข้อมูลสนาม" });
        }

        // 🔹 ดึงข้อมูลเจ้าของสนามจาก BusinessInfo
        const businessInfo = await BusinessInfo.findOne({ ownerId: substadium.ownerId });
        if (!businessInfo) {
            return res.status(404).json({ message: "ไม่พบข้อมูลธนาคารของเจ้าของสนาม" });
        }

        // ✅ ส่งข้อมูลกลับไปให้ Frontend
        res.json({
            booking,
            substadium,
            businessInfo
        });
    } catch (error) {
        console.error("❌ Error fetching payment details:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};

// ✅ บันทึกข้อมูลการชำระเงิน
exports.submitPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { paymentTime, amount, slipImage } = req.body;

        // 🔹 ตรวจสอบว่ามีข้อมูลการจองหรือไม่
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });
        }

        // 🔹 อัปเดตสถานะการชำระเงิน
        booking.paymentStatus = "ชำระเงินแล้ว";
        booking.paymentTime = paymentTime;
        booking.amountPaid = amount;
        booking.slipImage = slipImage; // URL ของภาพสลิป

        await booking.save();

        res.json({ message: "บันทึกการชำระเงินเรียบร้อยแล้ว", booking });
    } catch (error) {
        console.error("❌ Error submitting payment:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกการชำระเงิน" });
    }
};
