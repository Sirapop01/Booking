const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// ✅ เส้นทางดึงรายชื่อผู้ใช้ที่มีแชท
router.get("/chat-users", chatController.getUsersWithChat);

// ✅ เส้นทางดึงประวัติแชทของผู้ใช้
router.get("/chat-history/:userId", chatController.getChatHistory);

// ✅ เส้นทางส่งข้อความแชท
router.post("/chat/:userId", chatController.sendMessage);

module.exports = router;