const HistoryBooking = require("../models/HistoryBooking");

// ✅ ดึงประวัติการจองตาม userId
exports.getUserBookingHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "กรุณาระบุ userId" });
    }

    const bookingHistory = await HistoryBooking.find({ userId })
      .populate("stadiumId", "name location") // ดึงข้อมูลสนามที่เกี่ยวข้อง
      .sort({ bookingDate: -1 }); // เรียงจากใหม่ -> เก่า

    res.status(200).json(bookingHistory);
  } catch (error) {
    console.error("❌ Error fetching booking history:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงประวัติการจอง" });
  }
};

// ✅ ดึงรายละเอียดการจองรายบุคคล
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await HistoryBooking.findById(id).populate("stadiumId", "name location");

    if (!booking) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการจองนี้" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง" });
  }
};
