const BookingHistory = require("../models/BookingHistory");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");

// ✅ บันทึกการจองลงในฐานข้อมูล
exports.addBookingHistory = async (req, res) => {
    try {
        const { userId, stadiumId, ownerId, bookingDate, status } = req.body;

        if (!userId || !stadiumId || !ownerId || !bookingDate) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
        }

        const newBooking = new BookingHistory({
            userId,
            stadiumId,
            ownerId,
            bookingDate,
            status: status || "completed",
        });

        await newBooking.save();

        res.status(201).json({ message: "✅ บันทึกการจองสำเร็จ!", booking: newBooking });

    } catch (error) {
        console.error("🚨 Error adding booking history:", error);
        res.status(500).json({ message: "❌ ไม่สามารถบันทึกการจองได้" });
    }
};

// ✅ ดึงสนามที่ลูกค้าเคยจอง (สำหรับรีวิว)
exports.getUserBookingHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "❌ ต้องระบุ userId" });
        }

        // ✅ ดึงข้อมูลสนามเพิ่มเติม รวมถึงรูปภาพ
        const bookings = await BookingHistory.find({ userId, status: "completed" })
            .populate("stadiumId", "fieldName stadiumImage") // ✅ เพิ่ม stadiumImage
            .select("sportName timeRange bookingDate status stadiumId");

        if (!bookings.length) {
            return res.status(404).json({ message: "❌ ไม่พบประวัติการจอง" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("🚨 Error fetching booking history:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงประวัติการจองได้" });
    }
};



