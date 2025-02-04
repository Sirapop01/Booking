const express = require("express");
const router = express.Router();
const { sendEmailNotification } = require("../controllers/notificationController");

// ✅ Route สำหรับส่ง Email แจ้งเตือน
router.post("/send-email", sendEmailNotification);

module.exports = router;
