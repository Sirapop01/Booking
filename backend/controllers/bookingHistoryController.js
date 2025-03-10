const BookingHistory = require("../models/BookingHistory");
const Arena = require("../models/Arena");
const jwt = require("jsonwebtoken");

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
            timeSlots: { $elemMatch: { $in: timeSlots } } // ✅ เช็คการจองซ้ำที่ทับซ้อน
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

        // ✅ ดึงข้อมูลสนามหลัก และสนามย่อย รวมถึงรูปภาพ
        const bookings = await BookingHistory.find({ userId, status: "completed" })
            .populate({ path: "stadiumId", select: "fieldName stadiumImage" }) // ✅ ดึงข้อมูลสนามใหญ่
            .populate({ path: "subStadiumId", select: "name images" }) // ✅ ดึงข้อมูลสนามย่อย
            .select("sportName timeSlots bookingDate status stadiumId subStadiumId");

        if (!bookings.length) {
            return res.status(404).json({ message: "❌ ไม่พบประวัติการจอง" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("🚨 Error fetching booking history:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงประวัติการจองได้" });
    }
};
