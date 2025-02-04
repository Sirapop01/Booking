const express = require("express");
const BusinessOwner = require("../controllers/businessController"); // ✅ ตรวจสอบการ import
const router = express.Router();

router.post("/register", BusinessOwner.registerBusinessOwner); // ✅ ตรวจสอบว่าฟังก์ชันนี้ไม่ใช่ undefined
router.get("/find-owner", BusinessOwner.findBusinessOwner);

module.exports = router;
