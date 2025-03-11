const BookingHistory = require("../models/BookingHistory");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // ✅ แก้ปัญหา mongoose is not defined
const Stadium = require("../models/Stadium");
// ✅ ฟังก์ชันเพิ่มการจองใหม่
exports.addBookingHistory = async (req, res) => {
    try {
        const { userId, stadiumId, subStadiumId, ownerId, sportName, timeSlots, bookingDate, status } = req.body;

        // ✅ ตรวจสอบข้อมูลที่ต้องมี
        if (!userId || !stadiumId || !subStadiumId || !ownerId || !sportName || !timeSlots || !bookingDate) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
        }

        // ✅ ตรวจสอบว่า timeSlots เป็น Array จริงหรือไม่
        if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
            return res.status(400).json({ message: "❌ ต้องระบุช่วงเวลาที่ต้องการจอง" });
        }

        // ✅ ตรวจสอบว่าช่วงเวลาที่เลือกถูกจองไปแล้วหรือไม่
        const existingBookings = await BookingHistory.find({
            subStadiumId,
            bookingDate: new Date(bookingDate), // ✅ ใช้ Date Object ให้แน่ใจว่าเปรียบเทียบตรงกัน
            timeSlots: { $elemMatch: { $in: timeSlots } } // ✅ เช็คการจองซ้ำที่ทับซ้อนa
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "❌ เวลาที่เลือกถูกจองไปแล้ว กรุณาเลือกเวลาใหม่" });
        }

        // ✅ บันทึกการจองใหม่
        const newBooking = new BookingHistory({
            userId,
            stadiumId,
            subStadiumId,
            ownerId,
            sportName,
            timeSlots,
            bookingDate: new Date(bookingDate), // ✅ บันทึกเป็น Date Object
            status: status || "completed",
        });

        await newBooking.save();

        res.status(201).json({ message: "✅ บันทึกการจองสำเร็จ!", booking: newBooking });

    } catch (error) {
        console.error("🚨 Error adding booking history:", error);
        res.status(500).json({ message: "❌ ไม่สามารถบันทึกการจองได้" });
    }
};


// ✅ ดึงประวัติการจองของลูกค้า
exports.getUserBookingHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "❌ ต้องระบุ userId" });
        }

        console.log("🔍 กำลังดึงประวัติการจองของ userId:", userId);

        // ✅ ดึงข้อมูลการจองพร้อมข้อมูลสนามย่อย
        const bookings = await BookingHistory.find({ userId })
            .populate({ path: "details.subStadiumId", select: "name images", options: { strictPopulate: false } })
            .lean();

        console.log("📌 Raw Bookings from DB:", bookings);

        if (!bookings.length) {
            console.log("❌ ไม่พบประวัติการจอง");
            return res.status(404).json({ message: "❌ ไม่พบประวัติการจอง" });
        }

        // ✅ ดึง stadiumId ที่ต้องใช้
        const stadiumIds = bookings.map(b => b.stadiumId).filter(id => id);
        const arenas = await Arena.find({ _id: { $in: stadiumIds } }).lean();

        console.log("📌 Arena Data:", arenas);

        // ✅ รวมข้อมูล Booking + Arena + SubStadium + Sport Name
        const updatedBookings = bookings.map(booking => {
            const arena = arenas.find(a => String(a._id) === String(booking.stadiumId));

            return {
                _id: booking._id,
                userId: booking.userId,
                stadiumId: booking.stadiumId || null,
                fieldName: arena ? arena.fieldName : "ไม่พบชื่อสนาม",
                stadiumImage: arena?.images?.[0] || "https://via.placeholder.com/150",
                totalPrice: booking.totalPrice,
                status: booking.status,
                expiresAt: booking.expiresAt,
                details: booking.details.map(detail => ({
                    subStadiumId: detail.subStadiumId?._id || null,
                    subStadiumName: detail.subStadiumId?.name || "ไม่พบชื่อสนามย่อย",
                    sportName: detail.sportName, // ✅ ดึง sportName มาด้วย
                    bookingDate: detail.bookingDate,
                    startTime: detail.startTime,
                    endTime: detail.endTime,
                    duration: detail.duration,
                    price: detail.price
                }))
            };
        });

        console.log("✅ ข้อมูลที่ส่งไปยัง frontend:", updatedBookings);
        res.status(200).json(updatedBookings);

    } catch (error) {
        console.error("❌ Error fetching booking history:", error.message);
        res.status(500).json({ message: "❌ ไม่สามารถดึงประวัติการจองได้" });
    }
};



// ✅ ฟังก์ชันใหม่สำหรับบันทึกการจองโดยตรง
exports.confirmBooking = async (req, res) => {
    try {
        console.log("📌 ข้อมูลที่ได้รับจาก Frontend:", req.body);

        const { sessionId, userId, stadiumId, ownerId, bookingDate, expiresAt, totalPrice, details } = req.body;

        if (!details || !Array.isArray(details) || details.length === 0) {
            return res.status(400).json({ message: "❌ ไม่มีข้อมูลการจองที่ถูกต้อง" });
        }

        // ✅ ตรวจสอบว่ามี sessionId ซ้ำหรือไม่
        const existingBooking = await BookingHistory.findOne({ sessionId });
        if (existingBooking) {
            return res.status(400).json({ message: "❌ Session นี้มีอยู่แล้วในระบบ" });
        }

        // ✅ สร้าง BookingHistory เดียวที่รวมข้อมูลทั้งหมด
        const newBooking = new BookingHistory({
            sessionId,
            userId,
            stadiumId,
            ownerId,
            bookingDate,
            expiresAt,
            totalPrice,
            details
        });

        await newBooking.save();
        res.status(201).json({ message: "✅ การจองสำเร็จ", booking: newBooking });

    } catch (error) {
        console.error("❌ Error confirming booking:", error);
        res.status(500).json({ message: "❌ ไม่สามารถบันทึกการจองได้", error: error.message });
    }
};






