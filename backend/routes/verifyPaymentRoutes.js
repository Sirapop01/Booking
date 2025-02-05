const express = require("express");
const router = express.Router();
const verifyPaymentController = require("../controllers/verifyPaymentController");

// ✅ ดึงรายชื่อผู้ใช้ที่มีการชำระเงิน
router.get("/payment-users", verifyPaymentController.getPaymentUsers);

// ✅ ดึงรายการชำระเงินของผู้ใช้
router.get("/payment-history/:userId", verifyPaymentController.getPaymentHistory);

// ✅ ยืนยันการชำระเงิน
router.put("/confirm-payment/:userId", verifyPaymentController.confirmPayment);

// ✅ ปฏิเสธการชำระเงิน
router.post("/reject-payment/:userId", verifyPaymentController.rejectPayment);

// ✅ ดึงสลิปการโอนเงิน
router.get("/payment-slip/:userId", verifyPaymentController.getPaymentSlip);

module.exports = router;
