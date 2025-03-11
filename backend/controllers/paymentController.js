const jwt = require("jsonwebtoken");
const BookingHistory = require("../models/BookingHistory");
const SubStadium = require("../models/subStadiumModel");
const BusinessInfo = require("../models/BusinessInfo");
const Payment = require("../models/Payment");
const Arena = require("../models/Arena");

exports.getPendingPayment = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "ไม่ได้รับ Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // ✅ ค้นหาคำสั่งจองที่ยังไม่จ่าย
        const booking = await BookingHistory.findOne({ userId, status: "pending" })
            .select("details totalPrice expiresAt sessionId")
            .lean(); // ✅ แปลง MongoDB object เป็น JSON

        if (!booking) {
            console.log("❌ ไม่พบคำสั่งจองที่รอดำเนินการ");
            return res.status(404).json({ message: "ไม่พบคำสั่งจองที่รอดำเนินการ" });
        }

        console.log("✅ booking.details มีข้อมูล:", booking.details);

        // ✅ ดึง subStadiumId ทั้งหมดจากคำสั่งจอง
        const subStadiumIds = booking.details.map(detail => detail.subStadiumId);

        // ✅ ดึงข้อมูลสนามทั้งหมด
        const subStadiums = await SubStadium.find({ _id: { $in: subStadiumIds } }).lean();
        if (!subStadiums.length) {
            console.log("❌ ไม่พบข้อมูลสนาม");
            return res.status(404).json({ message: "ไม่พบข้อมูลสนาม" });
        }

        console.log("✅ พบข้อมูลสนาม:", subStadiums);

        // ✅ ดึง owner_id จาก subStadiums
        const ownerIds = [...new Set(subStadiums.map(stadium => stadium.owner_id))];
        const arenaId = [...new Set(subStadiums.map(stadium => stadium.arenaId))];

        // ✅ ดึงข้อมูลธนาคารของเจ้าของสนาม
        const businessInfos = await BusinessInfo.find({ businessOwnerId: { $in: ownerIds } }).lean();
        if (!businessInfos.length) {
            console.log("❌ ไม่พบข้อมูลเจ้าของสนาม");
            return res.status(404).json({ message: "ไม่พบข้อมูลธุรกิจเจ้าของสนาม" });
        }

        console.log("✅ พบข้อมูลธุรกิจ:", businessInfos);

        const arenaInfo = await Arena.find({ _id : { $in: arenaId } }).lean();
        if (!arenaInfo.length) {
            console.log("ไม่พบข้อมูลarena")
            return res.status(404).json({ message: "ไม่พบข้อมูลarena" })
        }
        // ✅ ส่งข้อมูลไปยัง Frontend
        res.status(200).json({
            booking,
            stadiumInfo: subStadiums,  // อาจมีหลายสนาม
            bankInfo: businessInfos[0], // เลือกอันแรกถ้ามีหลายอัน
            arenaInfo 
        });

    } catch (error) {
        console.error("❌ Error fetching payment details:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

exports.submitPayment = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "ไม่ได้รับ Token" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const { sessionId, amount, transferTime } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: "กรุณาอัปโหลดสลิปโอนเงิน" });
      }

      const slipImage = req.file ? req.file.path : null;
  
      // ✅ ค้นหาคำสั่งจองที่เกี่ยวข้อง
      const booking = await BookingHistory.findOne({ sessionId, userId });
      if (!booking) {
        return res.status(404).json({ message: "ไม่พบคำสั่งจองที่เกี่ยวข้อง" });
      }
  
      // ✅ บันทึกข้อมูลลง Database
      const newPayment = new Payment({
        userId,
        sessionId,
        bookingId: booking._id,
        amount,
        transferTime,
        slipImage, 
        status: "paid",
        details: booking.details, // ✅ เก็บข้อมูลการจอง
      });
  
      await newPayment.save();
  
      // ✅ อัปเดตสถานะ Booking เป็น "paid"
      await BookingHistory.findOneAndUpdate({ sessionId }, { status: "paid" });
  
      res.status(201).json({ message: "บันทึกข้อมูลการชำระเงินเรียบร้อย", payment: newPayment });
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
  };
