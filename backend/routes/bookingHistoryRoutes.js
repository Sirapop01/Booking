const express = require("express");
const { addBookingHistory, getUserBookingHistory } = require("../controllers/bookingHistoryController");

const router = express.Router();

// ✅ บันทึกการจองหลังจาก Booking
router.post("/booking-history", addBookingHistory);

// ✅ ดึงรายการจองของ User เพื่อแสดงในหน้าส่งรีวิว
router.get("/user/stadiums-used", getUserBookingHistory);

module.exports = router;
