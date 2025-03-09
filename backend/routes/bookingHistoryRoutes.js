const express = require("express");
const { getUserBookingHistory, addBookingHistory } = require("../controllers/bookingHistoryController");

const router = express.Router();

// ✅ ดึงประวัติการจองของผู้ใช้
router.get("/", getUserBookingHistory); // ✅ เพิ่ม Route ที่รองรับ `?userId=...`

// ✅ บันทึกการจอง
router.post("/booking-history", addBookingHistory);

module.exports = router;
