const express = require("express");
const router = express.Router();
const { getOwnerBookingHistory, getOwnerStadiums } = require("../controllers/ownerHistoryController");

// 📌 ดึงรายการสนามที่เป็นของเจ้าของ
router.get("/owner-stadiums", getOwnerStadiums);

// 📌 ดึงประวัติการจองของเจ้าของสนาม
router.get("/history", getOwnerBookingHistory);

module.exports = router;
