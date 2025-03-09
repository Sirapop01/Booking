const express = require("express");
const {
    submitReview,
    getStadiumReviews,
    deleteReviewsByOwner
} = require("../controllers/reviewController");

const router = express.Router();

// ✅ ตรวจสอบว่าฟังก์ชันถูกโหลดมาจริง
if (!submitReview || !getStadiumReviews || !deleteReviewsByOwner) {
    throw new Error("❌ Review Controller functions are missing!");
}

// ✅ ให้ลูกค้าส่งรีวิว (ตรวจสอบ Token ภายใน Controller)
router.post("/reviews", submitReview);

// ✅ ดึงรีวิวของสนาม (ผู้ใช้ทั่วไปสามารถดูได้)
router.get("/reviews/:stadiumId", getStadiumReviews);

// ✅ ลบรีวิวทั้งหมดของเจ้าของสนาม (ตรวจสอบ Token ภายใน Controller)
router.delete("/reviews/owner/:ownerId", deleteReviewsByOwner);

module.exports = router;
