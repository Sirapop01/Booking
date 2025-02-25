const express = require("express");
const multer = require("multer");
const path = require("path");
const { createPromotion, getAllPromotions, getPromotionsByStadium, deletePromotion } = require("../controllers/promotionController");

const router = express.Router();

// ตั้งค่าที่เก็บไฟล์รูปภาพ
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ [POST] เพิ่มโปรโมชั่น
router.post("/", upload.single("promotionImage"), createPromotion);

// ✅ [GET] ดึงรายการโปรโมชั่นทั้งหมด
router.get("/", getAllPromotions);

// ✅ [GET] ดึงโปรโมชั่นตามสนามกีฬา
router.get("/stadium/:stadiumId", getPromotionsByStadium);

// ✅ [DELETE] ลบโปรโมชั่น
router.delete("/:id", deletePromotion);

module.exports = router;
