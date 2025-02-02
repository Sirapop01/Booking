const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController"); // ✅ นำเข้า controller

// ✅ ใช้ `uploadController.upload` ในการอัปโหลดไฟล์
router.post("/uploadProfile", uploadController.upload.single("profileImage"), uploadController.uploadProfileImage);

module.exports = router;
