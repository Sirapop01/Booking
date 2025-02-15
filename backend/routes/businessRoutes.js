const express = require("express");
const BusinessOwner = require("../controllers/businessController"); // ✅ ตรวจสอบการ import
const router = express.Router();

router.post("/register", BusinessOwner.registerBusinessOwner); // ✅ ตรวจสอบว่าฟังก์ชันนี้ไม่ใช่ undefined
router.get("/getinfo/:id", BusinessOwner.getMB);
router.put("/update/:id", BusinessOwner.updateUser);
router.post("/reset-password/:token", BusinessOwner.resetPassword);
router.post("/forgot-password", BusinessOwner.sendResetPasswordEmail);

module.exports = router;
