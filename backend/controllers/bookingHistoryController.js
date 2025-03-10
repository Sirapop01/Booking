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

// ✅ ดึงสนามที่ลูกค้าเคยจอง 
exports.getUserBookingHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "❌ ต้องระบุ userId" });
        }

        console.log("🔍 Fetching booking history for userId:", userId);

        // ✅ ดึงข้อมูลสนามเพิ่มเติม รวมถึง `fieldName` และ `images`
        let bookings = await BookingHistory.find({ userId })
            .populate({
                path: "stadiumId",
                select: "fieldName images",
                options: { strictPopulate: false }
            })
            .lean(); // ✅ ใช้ lean() เพื่อให้ MongoDB คืนค่าเป็น Object  

        console.log("📌 Raw bookings from DB:", bookings);

        // ✅ กรองข้อมูลที่ไม่มีสนาม และดึง `images[0]` ถ้ามี
        const updatedBookings = bookings
            .filter(booking => booking.stadiumId) // ✅ กรองรายการที่ไม่มีสนาม
            .map(booking => ({
                _id: booking._id,
                userId: booking.userId,
                stadiumId: booking.stadiumId._id,
                fieldName: booking.stadiumId.fieldName || "ไม่พบชื่อสนาม",
                stadiumImage: booking.stadiumId.images?.[0] || "https://via.placeholder.com/150",
                sportName: booking.sportName,
                timeRange: booking.timeRange,
                bookingDate: booking.bookingDate,
                status: booking.status
            }));

        console.log("✅ Processed Booking History:", updatedBookings);
        res.status(200).json(updatedBookings);

    } catch (error) {
        console.error("❌ Error fetching booking history:", error.message);
        res.status(500).json({ message: "❌ ไม่สามารถดึงประวัติการจองได้" });
    }
};







