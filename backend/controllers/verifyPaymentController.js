const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Payment = require("../models/Payment");
const secret = process.env.JWT_SECRET || "MatchWeb";  // ใช้ Secret เดียวกับ authController.js

exports.getPaymentUsers = async (req, res) => {
    try {
        // ✅ ตรวจสอบ Token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: '❌ ไม่พบ Token ในคำขอ' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);

        // ✅ ดึงผู้ใช้ที่มี state = "payment"
        const users = await User.find({ state: "payment" }).select("_id firstName lastName email");

        if (!users.length) {
            return res.status(404).json({ error: "❌ ไม่พบผู้ใช้ที่มีการชำระเงิน" });
        }

        res.json(users);
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: '❌ Token ไม่ถูกต้องหรือหมดอายุ' });
        }
        console.error("Error fetching payment users:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
};


exports.getPaymentDetails = async (req, res) => {
    try {
        const { state, userId } = req.query;  // ใช้ query parameters

        if (!userId || state !== "payment") {
            return res.status(400).json({ error: "❌ ต้องระบุ userId และ state ต้องเป็น 'payment'" });
        }

        const payments = await Payment.find({ userId, state }).sort({ dateTime: -1 });

        if (!payments.length) {
            return res.status(404).json({ error: "❌ ไม่พบรายการชำระเงิน" });
        }

        res.json(payments);
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน" });
    }
};



exports.getPaymentSlip = async (req, res) => {
    try {
        const { state, userId } = req.query;  // ใช้ query parameters

        if (!userId || state !== "payment") {
            return res.status(400).json({ error: "❌ ต้องระบุ userId และ state ต้องเป็น 'payment'" });
        }

        const payment = await Payment.findOne({ userId, state }).select("slipImageUrl");

        if (!payment || !payment.slipImageUrl) {
            return res.status(404).json({ error: "❌ ไม่พบสลิปการโอนเงิน" });
        }

        res.json({ slipImageUrl: payment.slipImageUrl });
    } catch (error) {
        console.error("Error fetching slip image:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงสลิปการโอนเงิน" });
    }
};


