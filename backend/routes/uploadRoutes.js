const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadImage, getImages } = require("../controllers/uploadController");

const router = express.Router();

// ตั้งค่าการอัปโหลดด้วย Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // เก็บไฟล์ที่โฟลเดอร์ uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // เปลี่ยนชื่อไฟล์เป็น timestamp
    }
});

const upload = multer({ storage });

// Route สำหรับอัปโหลดรูป
router.post("/upload", upload.single("image"), uploadImage);

// Route สำหรับดึงข้อมูลรูปทั้งหมด
router.get("/images", getImages);

module.exports = router;
