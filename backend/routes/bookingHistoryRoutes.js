const express = require("express");
const { getUserBookingHistory, addBookingHistory, confirmBooking, cancelExpiredBooking} = require("../controllers/bookingHistoryController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const bookingHistoryController = require("../controllers/bookingHistoryController");

// ✅ ดึงประวัติการจองของผู้ใช้
router.get("/", bookingHistoryController.getUserBookingHistory);

// ✅ บันทึกการจอง
router.post("/booking-history", protect, addBookingHistory);

router.post("/confirm-booking", protect, confirmBooking);

router.post("/cancel-expired", protect, cancelExpiredBooking);
module.exports = router;
