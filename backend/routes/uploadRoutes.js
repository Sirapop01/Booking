const express = require("express");
const { uploadProfileImage, uploadArenaImage, upload } = require("../controllers/uploadController");

const router = express.Router();

// ✅ API สำหรับอัปโหลดรูปโปรไฟล์
router.post("/profile", upload.single("image"), uploadProfileImage);

// ✅ API สำหรับอัปโหลดรูปสนามกีฬา
router.post("/arena", upload.single("image"), uploadArenaImage);

module.exports = router;
