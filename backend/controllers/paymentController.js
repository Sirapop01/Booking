const jwt = require("jsonwebtoken");
const BookingHistory = require("../models/BookingHistory");
const SubStadium = require("../models/subStadiumModel");
const BusinessInfo = require("../models/BusinessInfo");
const Payment = require("../models/Payment");
const Arena = require("../models/Arena");
const { ObjectId } = require("mongoose").Types; // ✅ นำเข้า ObjectId


exports.getPendingPayment = async (req, res) => {
  try {
      console.log("📌 Headers ที่ได้รับจาก Client:", req.headers);

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
          return res.status(401).json({ message: "ไม่ได้รับ Token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let userId = decoded.id;

      // ✅ ตรวจสอบว่า userId เป็น ObjectId หรือไม่
      try {
          userId = new ObjectId(userId);
      } catch (err) {
          console.log("⚠ userId ไม่สามารถแปลงเป็น ObjectId ได้, ใช้ค่าเดิม");
      }

      console.log("✅ Token ถูกต้อง, User ID:", userId);

      // ✅ ตรวจสอบว่าได้รับ sessionId หรือไม่
      const { sessionId } = req.query;
      let bookingQuery = {
          userId: userId,
          status: "pending",
      };

      if (sessionId) {
          bookingQuery.sessionId = { $regex: `^${sessionId}$`, $options: "i" };
      }

      console.log("📌 Query ที่ใช้ค้นหาใน BookingHistory:", bookingQuery);

      const booking = await BookingHistory.findOne(bookingQuery)
          .select("details totalPrice expiresAt sessionId stadiumId ownerId fieldName")
          .lean();

      if (!booking) {
          console.log("❌ ไม่พบข้อมูลการจองในฐานข้อมูล!");
          return res.status(404).json({ message: "ไม่พบคำสั่งจองที่รอดำเนินการ" });
      }

      console.log("✅ ข้อมูลการจองที่พบ:", booking);

      // ✅ ดึงข้อมูลสนามทั้งหมด
      const subStadiumIds = booking.details.map(detail => detail.subStadiumId);
      const subStadiums = await SubStadium.find({ _id: { $in: subStadiumIds } }).lean();

      console.log("✅ พบข้อมูลสนาม:", subStadiums.length > 0 ? subStadiums : "ไม่มีข้อมูลสนาม");

      // ✅ ดึง `owner_id` ของสนามที่จอง
      const ownerId = booking.ownerId || subStadiums[0]?.owner_id;
      
      // ✅ ดึงข้อมูลธุรกิจของเจ้าของสนาม
      const businessInfo = await BusinessInfo.findOne({ businessOwnerId: ownerId }).lean();

      console.log("✅ ข้อมูลธุรกิจ:", businessInfo ? businessInfo : "ไม่มีข้อมูลธุรกิจ");

      // ✅ ดึงข้อมูล Arena
      const arenaInfo = await Arena.findOne({ _id: booking.stadiumId }).lean();

      console.log("✅ ข้อมูลสนามกีฬา (Arena):", arenaInfo ? arenaInfo : "ไม่มีข้อมูล Arena");

      // ✅ ส่ง Response โดยไม่ให้เกิด `404` ถ้ามีข้อมูลบางส่วน
      res.status(200).json({
          booking,
          stadiumInfo: subStadiums.length > 0 ? subStadiums : null,
          bankInfo: businessInfo || null,  // ✅ ถ้าไม่มีข้อมูล ให้ส่ง `null` แทน
          arenaInfo: arenaInfo || null, // ✅ ถ้าไม่มีข้อมูล ให้ส่ง `null` แทน
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
