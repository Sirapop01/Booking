const Review = require("../models/Review");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");
const Stadium = require("../models/Stadium");
require("dotenv").config();

// ✅ ให้ลูกค้าส่งรีวิว (ใช้ Middleware ดีกว่า)
exports.submitReview = async (req, res) => {
    try {
        const { stadiumId, rating, comment } = req.body;

        // ✅ ตรวจสอบว่า Token ถูกส่งมาหรือไม่
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!stadiumId || !rating || !comment) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน กรุณาให้คะแนนและแสดงความคิดเห็น" });
        }

        // ✅ ตรวจสอบว่าสนามนี้มีอยู่จริง
        const stadium = await Arena.findById(stadiumId);
        if (!stadium) {
            return res.status(404).json({ message: "❌ ไม่พบสนามกีฬานี้" });
        }

        // ✅ บันทึกรีวิวใหม่ทุกครั้งที่กดส่งรีวิว
        const newReview = new Review({
            stadiumId,
            ownerId: stadium.businessOwnerId, 
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
        res.status(500).json({ message: "❌ ไม่สามารถบันทึกรีวิวได้", error: error.message });
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

        console.log("📌 Fetching reviews for stadiumId:", stadiumId);

        // ✅ ตรวจสอบว่ามีสนามนี้อยู่จริง
        const stadium = await Arena.findById(stadiumId);
        if (!stadium) {
            return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนามกีฬา" });
        }

        // ✅ ดึงรีวิวทั้งหมดของสนาม และ populate ข้อมูล user
        const reviews = await Review.find({ stadiumId })
            .populate("userId", "firstName lastName email") // ✅ ดึงข้อมูลผู้ใช้ที่รีวิว
            .sort({ createdAt: -1 });

        console.log("📌 Reviews Data:", reviews);

        res.status(200).json({
            stadium: {
                _id: stadium._id,
                fieldName: stadium.fieldName,
                ownerName: stadium.ownerName,
                phone: stadium.phone,
                startTime: stadium.startTime,
                endTime: stadium.endTime,
                location: stadium.location,
                images: stadium.images
            },
            reviews
        });
    } catch (error) {
        console.error("🚨 Error fetching stadium reviews:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลรีวิวได้" });
    }
};
