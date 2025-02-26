const express = require("express");
const multer = require("multer");
const path = require("path");
const { createPromotion, getAllPromotions, getPromotionsByStadium, deletePromotion } = require("../controllers/promotionController");
const { uploadImage } = require("../controllers/uploadController"); // ✅ นำเข้า uploadImage สำหรับ Cloudinary

const router = express.Router();

// ✅ ตั้งค่า Multer สำหรับอัปโหลดเป็นไฟล์ (บันทึกลงโฟลเดอร์)
const diskStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ ตั้งค่า Multer สำหรับอัปโหลด Buffer (ใช้งานกับ Cloudinary)
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

// ✅ [POST] อัปโหลดรูปไปยัง Cloudinary
router.post("/upload", upload.single("promotionImage"), uploadImage);

// ✅ [POST] เพิ่มโปรโมชั่น (ใช้ไฟล์ที่อัปโหลดลงเซิร์ฟเวอร์)
router.post("/", multer({ storage: diskStorage }).single("promotionImage"), createPromotion);

// ✅ [GET] ดึงรายการโปรโมชั่นทั้งหมด
router.get("/", getAllPromotions);

// ✅ [GET] ดึงโปรโมชั่นตามสนามกีฬา
router.get("/stadium/:stadiumId", getPromotionsByStadium);

// ✅ [DELETE] ลบโปรโมชั่น
router.delete("/:id", deletePromotion);

module.exports = router;
