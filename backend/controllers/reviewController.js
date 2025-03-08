const Review = require("../models/Review");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ ให้ลูกค้าส่งรีวิว (ใช้ Middleware ดีกว่า)
exports.submitReview = async (req, res) => {
    try {
        const { stadiumId, rating, comment } = req.body;

        // ✅ ดึง Token และถอดรหัส
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!stadiumId || !rating || !comment) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
        }

        // ✅ ตรวจสอบว่าสนามนี้มีอยู่จริง
        const stadium = await Arena.findById(stadiumId);
        if (!stadium) {
            return res.status(404).json({ message: "❌ ไม่พบสนามกีฬานี้" });
        }

        // ✅ ป้องกันการรีวิวซ้ำ (เช็คว่า user เคยรีวิวสนามนี้แล้วหรือไม่)
        const existingReview = await Review.findOne({ stadiumId, userId });
        if (existingReview) {
            return res.status(400).json({ message: "⚠️ คุณได้รีวิวสนามนี้ไปแล้ว" });
        }

        // ✅ บันทึกรีวิวใหม่
        const newReview = new Review({
            stadiumId,
            ownerId: stadium.businessOwnerId, // ✅ เพิ่ม Owner ID
            userId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({
            message: "✅ รีวิวถูกบันทึกเรียบร้อย!",
            review: newReview,
        });

    } catch (error) {
        console.error("🚨 Error submitting review:", error);
        res.status(500).json({ message: "❌ ไม่สามารถบันทึกรีวิวได้" });
    }
};

// ✅ ลบรีวิวทั้งหมดของเจ้าของสนาม (เช่นเมื่อบัญชีถูกลบ)
exports.deleteReviewsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const result = await Review.deleteMany({ ownerId });

        res.status(200).json({
            message: `✅ ลบรีวิวทั้งหมดของเจ้าของสนามสำเร็จ (${result.deletedCount} รีวิว)`,
        });

    } catch (error) {
        console.error("🚨 Error deleting reviews:", error);
        res.status(500).json({ message: "❌ ไม่สามารถลบรีวิวได้" });
    }
};

// ✅ ดึงรีวิวทั้งหมดของสนามกีฬา
exports.getStadiumReviews = async (req, res) => {
    try {
        const { stadiumId } = req.params;

        const reviews = await Review.find({ stadiumId })
            .populate("userId", "firstName lastName email") // ✅ เพิ่มข้อมูล User
            .sort({ createdAt: -1 }); // ✅ เรียงลำดับใหม่สุดก่อน

        res.status(200).json(reviews);
    } catch (error) {
        console.error("🚨 Error fetching reviews:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลรีวิวได้" });
    }
};
