const express = require("express");
const { registerAdmin } = require("../controllers/adminController");
const upload = require("../middlewares/upload"); // ใช้ Multer สำหรับอัปโหลดไฟล์
const { protect, superAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ สมัคร Admin (เฉพาะ SuperAdmin)
router.post("/register", protect, superAdminAuth, upload.single('profileImage'), registerAdmin);

module.exports = router;
