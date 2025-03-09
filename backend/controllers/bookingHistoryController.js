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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // ✅ ค้นหาการจองทั้งหมดของผู้ใช้
        const bookings = await BookingHistory.find({ userId, status: "completed" })
            .populate("stadiumId", "fieldName");

        if (!bookings.length) {
            return res.status(404).json({ message: "❌ คุณยังไม่เคยใช้บริการสนามใด" });
        }

        // ✅ ดึงข้อมูลสนามจากการจอง
        const stadiums = bookings.map(booking => ({
            _id: booking.stadiumId._id,
            fieldName: booking.stadiumId.fieldName
        }));

        res.status(200).json(stadiums);
    } catch (error) {
        console.error("🚨 Error fetching stadiums used:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลสนามได้" });
    }
};

