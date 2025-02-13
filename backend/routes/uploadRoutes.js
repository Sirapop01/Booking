const express = require("express");
const { uploadImage, upload } = require("../controllers/uploadController");

const router = express.Router();

// ✅ API สำหรับอัปโหลดรูปโปรไฟล์
router.post("/images", upload.single("image"), uploadImage);



module.exports = router;
