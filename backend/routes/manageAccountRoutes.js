const express = require("express");
const router = express.Router();
const ManageAccountController = require("../controllers/manageAccountController");

// 📌 API สำหรับการตรวจสอบบัญชีผู้ใช้
router.get("/", ManageAccountController.getUsers);          // ดึงผู้ใช้ทั้งหมด
router.get("/:id", ManageAccountController.getUserById);  // ดึงข้อมูลผู้ใช้ตาม ID
router.delete("/:id", ManageAccountController.deleteUser); // ลบบัญชี
router.put("/blacklist/:id", ManageAccountController.toggleBlacklistUser); // ตั้ง/ยกเลิก Blacklist

module.exports = router;
