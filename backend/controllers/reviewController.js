const Review = require("../models/Review");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");
const Stadium = require("../models/Stadium");
const BookingHistory = require("../models/BookingHistory");
require("dotenv").config();

// ✅ ให้ลูกค้าส่งรีวิว (ใช้ Middleware ดีกว่า)
exports.submitReview = async (req, res) => {
    try {
        const { stadiumId, rating, comment } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!stadiumId || !rating) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน กรุณาให้คะแนน" });
        }

        // ✅ ตรวจสอบว่าสนามมีอยู่จริง
        const stadium = await Arena.findById(stadiumId);
        if (!stadium) {
            return res.status(404).json({ message: "❌ ไม่พบสนามกีฬานี้" });
        }

        // ✅ ตรวจสอบว่าผู้ใช้มีการจองที่ `paid` หรือ `confirmed` หรือไม่
        const booking = await BookingHistory.findOne({
            userId,
            stadiumId,
            status: { $in: ["paid", "confirmed"] } // ✅ ตรวจสอบสถานะ
        });

        if (!booking) {
            return res.status(403).json({ message: "❌ คุณสามารถรีวิวได้เฉพาะสนามที่เคยจองและชำระเงินแล้วเท่านั้น" });
        }

        // ✅ บันทึกรีวิวใหม่
        const newReview = new Review({
            stadiumId,
            ownerId: stadium.businessOwnerId,
            userId,
            rating,
            comment: comment?.trim() || "",
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
        const token = req.headers.authorization?.split(" ")[1];

        let bookingStatus = null; // ✅ สร้างตัวแปรเก็บสถานะการจอง

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // ✅ ตรวจสอบว่าผู้ใช้เคยจองสนามนี้และสถานะเป็น "paid" หรือ "confirmed"
            const userBooking = await BookingHistory.findOne({
                userId,
                stadiumId,
                status: { $in: ["paid", "confirmed"] } // ✅ ตรวจสอบเฉพาะสถานะที่อนุญาตให้รีวิว
            });

            if (userBooking) {
                bookingStatus = userBooking.status; // ✅ กำหนดสถานะการจองของผู้ใช้
            }
        }

        const stadium = await Arena.findById(stadiumId);
        if (!stadium) {
            return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนามกีฬา" });
        }

        const reviews = await Review.find({ stadiumId })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            stadium: {
                _id: stadium._id,
                fieldName: stadium.fieldName,
                startTime: stadium.startTime,
                endTime: stadium.endTime,
                images: stadium.images,
            },
            bookingStatus, // ✅ เพิ่มสถานะการจองของผู้ใช้ใน Response
            reviews
        });
    } catch (error) {
        console.error("🚨 Error fetching stadium reviews:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลรีวิวได้" });
    }
};

// ✅ ลบคอมเมนต์รีวิว (ต้องเป็นเจ้าของรีวิว หรือแอดมิน)
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const userRole = decoded.role; // ตรวจสอบสิทธิ์แอดมิน

        // ✅ ตรวจสอบว่ามีรีวิวจริงหรือไม่
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "❌ ไม่พบรีวิวที่ต้องการลบ" });
        }

        // ✅ อนุญาตให้ลบได้เฉพาะเจ้าของรีวิว หรือแอดมินเท่านั้น
        if (review.userId.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "❌ คุณไม่มีสิทธิ์ลบรีวิวนี้" });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "✅ ลบรีวิวสำเร็จ!" });
    } catch (error) {
        console.error("🚨 Error deleting review:", error);
        res.status(500).json({ message: "❌ ไม่สามารถลบรีวิวได้", error: error.message });
    }
};



