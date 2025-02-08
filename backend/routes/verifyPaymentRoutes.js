const express = require("express");
const router = express.Router();
const verifyPaymentController = require("../controllers/verifyPaymentController");

// ✅ ดึงรายชื่อผู้ใช้ที่มีการชำระเงิน
router.get("/payment-users", verifyPaymentController.getPaymentUsers);

// ✅ ตรวจสอบให้แน่ใจว่ามี Route นี้
router.get("/payment-details/:userId", verifyPaymentController.getPaymentDetails);

// ✅ หรือถ้าใช้ Query Parameters ต้องแน่ใจว่ารองรับใน Controller
router.get("/payment-details", verifyPaymentController.getPaymentDetails);

module.exports = router;
