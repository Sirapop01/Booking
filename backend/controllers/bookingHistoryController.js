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

