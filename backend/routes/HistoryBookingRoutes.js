const express = require("express");
const router = express.Router();
const historyBookingController = require("../controllers/backend/controllers/HistoryBookingcontroller");

// ✅ ดึงประวัติการจองของผู้ใช้
router.get("/", historyBookingController.getUserBookingHistory);

// ✅ ดึงรายละเอียดของการจองตาม ID
router.get("/:id", historyBookingController.getBookingById);

module.exports = router;
