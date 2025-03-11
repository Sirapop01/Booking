const express = require("express");
const { getUserBookingHistory, addBookingHistory, confirmBooking} = require("../controllers/bookingHistoryController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// ✅ ดึงประวัติการจองของผู้ใช้
router.post("/", protect, getUserBookingHistory);

// ✅ บันทึกการจอง
router.post("/booking-history", protect, addBookingHistory);

router.post("/confirm-booking", protect, confirmBooking);

module.exports = router;
