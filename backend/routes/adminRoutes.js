const express = require("express");
const { registerAdmin } = require("../controllers/adminController");
const upload = require("../middlewares/upload"); // ใช้ Multer สำหรับอัปโหลดไฟล์
const router = express.Router();

// ✅ สมัคร Admin (เฉพาะ SuperAdmin)
router.post("/register", upload.single('profileImage'), registerAdmin);

module.exports = router;
