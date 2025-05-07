const express = require("express");
const {
    submitReview,
    getStadiumReviews,
    deleteReviewsByOwner,
    deleteReview
} = require("../controllers/reviewController");
const Review = require("../models/Review");
const router = express.Router();
const mongoose = require("mongoose"); 

// ✅ ตรวจสอบว่าฟังก์ชันถูกโหลดมาจริง
if (!submitReview || !getStadiumReviews || !deleteReviewsByOwner) {
    throw new Error("❌ Review Controller functions are missing!");
}

// ✅ ให้ลูกค้าส่งรีวิว (ตรวจสอบ Token ภายใน Controller)
router.post("/", submitReview);

// ✅ ดึงรีวิวของสนาม (ผู้ใช้ทั่วไปสามารถดูได้)
router.get("/:stadiumId", getStadiumReviews); // ✅ แก้ไขเส้นทางให้ถูกต้อง

// ✅ ลบรีวิวทั้งหมดของเจ้าของสนาม (ตรวจสอบ Token ภายใน Controller)
router.delete("/reviews/owner/:ownerId", deleteReviewsByOwner);

router.get("/owner/:ownerId", async (req, res) => {
    try {
        const { ownerId } = req.params;
        console.log("📡 API ถูกเรียกใช้งาน, ownerId:", ownerId);

        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "❌ ownerId ไม่ถูกต้อง" });
        }

        // ✅ ดึงข้อมูลรีวิวและรวมข้อมูลสนาม
        const reviews = await Review.find({ ownerId })
            .populate("userId", "firstName lastName")
            .populate("stadiumId", "fieldName") // ✅ เพิ่มเติมตรงนี้
            .sort({ createdAt: -1 });

        console.log("📊 ผลลัพธ์ที่ดึงจาก DB:", reviews);

        if (!reviews.length) {
            return res.status(404).json({ message: "❌ ไม่พบรีวิวสำหรับเจ้าของสนามนี้" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("🚨 Error fetching owner reviews:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลรีวิวได้" });
    }
});

// ✅ ลบรีวิวเดี่ยว (เฉพาะเจ้าของรีวิว หรือแอดมิน)
router.delete("/:reviewId", deleteReview);


module.exports = router;
