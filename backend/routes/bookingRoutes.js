const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// ✅ ดึงเวลาที่ถูกจองแล้วของสนามย่อย
router.get("/reserved-slots", bookingController.getReservedSlots);

// ✅ สร้างการจองใหม่
router.post("/create", bookingController.createBooking);

module.exports = router;
