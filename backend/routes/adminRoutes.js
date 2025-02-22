const express = require("express");
const { registerAdmin } = require("../controllers/adminController");
const upload = require("../middlewares/upload"); // ใช้ Multer สำหรับอัปโหลดไฟล์
const { protect, superAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ สมัคร Admin (เฉพาะ SuperAdmin)
router.post("/register", protect, superAdminAuth, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "idCardImage", maxCount: 1 },
]), registerAdmin);

module.exports = router;
