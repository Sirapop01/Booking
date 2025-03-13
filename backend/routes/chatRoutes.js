const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

console.log("✅ Chat Controller Functions Loaded:", Object.keys(chatController));

// ✅ ส่งข้อความ (Customer & BusinessOwner -> Admin/SuperAdmin เท่านั้น)
router.post("/sendMessage", chatController.sendMessage);

// ✅ ส่งข้อความจาก Admin ไปยัง User หรือ BusinessOwner
router.post("/sendMessageToUserOrOwner", chatController.sendMessageToUserOrOwner);  // เพิ่ม route นี้

// ✅ ดึงประวัติแชทระหว่างผู้ใช้ 2 คน
router.get("/history/:userId/:userModel", chatController.getChatHistory);

// ✅ อัปเดตสถานะ "อ่านข้อความแล้ว"
router.put("/mark-as-read/:messageId", chatController.markAsRead);

// ✅ ลบข้อความ (เฉพาะเจ้าของข้อความเท่านั้น)
router.delete("/delete/:messageId/:userId", chatController.deleteMessage);

// ✅ ให้ Admin ทุกคนสามารถดูรายชื่อผู้ใช้ที่เคยแชทได้
router.get("/chat-users", chatController.getChatUsers);

// ✅ **ดึง Admin คนแรกจาก Database หากไม่มี Admin ออนไลน์**
router.get("/get-any-admin", chatController.getAnyAdmin);

module.exports = router;
