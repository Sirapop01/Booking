const BookingHistory = require("../models/BookingHistory");
const Arena = require("../models/Arena");

// 📌 ดึงรายการสนามของเจ้าของ
const getOwnerStadiums = async (req, res) => {
    try {
        const { ownerId } = req.query; // ✅ ใช้ query แทน req.user.id
        if (!ownerId) {
            return res.status(400).json({ message: "กรุณาระบุ ownerId" });
        }

        console.log("📌 ownerId ที่รับมา:", ownerId);
        const stadiums = await Arena.find({ businessOwnerId: ownerId }).select("_id fieldName");

        if (!stadiums.length) {
            return res.status(404).json({ message: "ไม่พบสนามของคุณ" });
        }

        res.status(200).json(stadiums);
    } catch (error) {
        console.error("❌ Error fetching stadiums:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสนาม" });
    }
};



// 📌 ดึงประวัติการจองของเจ้าของสนาม
const getOwnerBookingHistory = async (req, res) => {
    try {
        const { ownerId } = req.query; // ✅ ใช้ Query String

        if (!ownerId) {
            return res.status(400).json({ message: "กรุณาระบุ ownerId" });
        }

        console.log("📌 ownerId ที่รับมา:", ownerId);

        // ✅ ค้นหาสนามที่เป็นของ Owner นี้
        const stadiums = await Arena.find({ businessOwnerId: ownerId }).select("_id");
        if (!stadiums.length) {
            return res.status(404).json({ message: "ไม่พบสนามของคุณ" });
        }

        const stadiumIds = stadiums.map((stadium) => stadium._id);

        // ✅ ดึงประวัติการจองของสนามเหล่านั้นที่มีสถานะ "confirmed" หรือ "paid"
        const bookings = await BookingHistory.find({
            stadiumId: { $in: stadiumIds },
            status: { $in: ["confirmed", "paid"] },
        }).populate("userId", "firstName lastName email");

        console.log("📌 ข้อมูลการจองที่ดึงมา:", bookings);

        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};

module.exports = { getOwnerStadiums, getOwnerBookingHistory };
