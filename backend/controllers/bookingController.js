const Booking = require("../models/Booking");

// ✅ API: ดึงช่วงเวลาที่ถูกจองแล้ว
exports.getReservedSlots = async (req, res) => {
    try {
        const { subStadiumId, date } = req.query;

        if (!subStadiumId || !date) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบ (subStadiumId หรือ date หายไป)" });
        }

        console.log(`🔍 กำลังตรวจสอบเวลาที่จองแล้ว: subStadiumId=${subStadiumId}, วันที่=${date}`);

        // ✅ แปลง `bookingDate` ให้เป็นวันเดียวกันแบบไร้เวลา
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);

        // ✅ ดึงข้อมูลการจองของสนามย่อยในวันนั้น
        const bookings = await Booking.find({
            subStadiumId,
            bookingDate: searchDate,
        }).select("timeRange");

        console.log("📌 เวลาที่ถูกจองแล้ว:", bookings);

        // ✅ ส่งคืนเวลาที่ถูกจอง (รูปแบบ Array)
        const reservedSlots = bookings.flatMap((b) => b.timeRange);

        res.status(200).json({ reservedSlots });
    } catch (error) {
        console.error("🚨 Error fetching reserved slots:", error);
        res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลการจองได้" });
    }
};

// ✅ API: บันทึกการจองใหม่
exports.createBooking = async (req, res) => {
    try {
        const { userId, stadiumId, subStadiumId, bookingDate, timeRange } = req.body;

        if (!userId || !stadiumId || !subStadiumId || !bookingDate || !timeRange) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบ กรุณากรอกให้ครบทุกช่อง" });
        }

        // ✅ ตรวจสอบว่า `timeRange` เป็น Array หรือไม่
        if (!Array.isArray(timeRange) || timeRange.length === 0) {
            return res.status(400).json({ message: "❌ timeRange ต้องเป็น Array และมีข้อมูล" });
        }

        // ✅ แปลง `bookingDate` เป็นวันเดียวกันแบบไร้เวลา
        const searchDate = new Date(bookingDate);
        searchDate.setHours(0, 0, 0, 0);

        // ✅ ตรวจสอบว่าเวลาที่เลือกถูกจองไปแล้วหรือไม่
        const existingBookings = await Booking.find({
            subStadiumId,
            bookingDate: searchDate,
            timeRange: { $in: timeRange }, // ✅ เช็คว่ามีช่วงเวลาไหนถูกจองไปแล้วหรือไม่
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "❌ เวลาที่เลือกถูกจองไปแล้ว กรุณาเลือกเวลาใหม่" });
        }

        // ✅ บันทึกการจองใหม่
        const newBooking = new Booking({
            userId,
            stadiumId,
            subStadiumId,
            bookingDate: searchDate, // ✅ บันทึกเป็น Date Object ที่ไม่มีเวลา
            timeRange,
        });

        await newBooking.save();
        res.status(201).json({ message: "✅ จองสนามสำเร็จ!", booking: newBooking });

    } catch (error) {
        console.error("🚨 Error creating booking:", error);
        res.status(500).json({ message: "❌ ไม่สามารถจองสนามได้" });
    }
};
