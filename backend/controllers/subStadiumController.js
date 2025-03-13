const SubStadium = require("../models/subStadiumModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const mongoose = require("mongoose");
const moment = require("moment");
const BookingHistory = require("../models/BookingHistory"); // ✅ นำเข้าตารางจอง

// 📌 ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ ดึงข้อมูลสนามย่อยทั้งหมดของสนามหลัก และประเภทกีฬาที่เลือก
exports.getSubStadiums = async (req, res) => {
    try {
        const { arenaId, sportId } = req.params;
        console.log("📌 ค่า arenaId:", arenaId, "sportId:", sportId);
  
        if (!arenaId || !sportId) {
            return res.status(400).json({ message: "❌ arenaId หรือ sportId ไม่ถูกต้อง" });
        }
  
        const subStadiums = await SubStadium.find({ 
            arenaId: String(arenaId), 
            sportId: String(sportId) 
        });
  
        res.status(200).json(subStadiums);
    } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลสนามย่อย:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสนามย่อย" });
    }
  };
  


// ✅ เพิ่มสนามย่อยใหม่ (พร้อมบันทึกลิงก์รูป)
exports.createSubStadium = async (req, res) => {
  try {
      const { 
          arenaId, sportId, name, description, intendant, phone, 
          openTime, closeTime, price, status, images: base64Images, owner_id 
      } = req.body;

      // ✅ ตรวจสอบว่า owner_id ถูกส่งมาหรือไม่
      if (!owner_id) {
          return res.status(400).json({ message: "❌ owner_id is required" });
      }

      let images = [];

      // ✅ 1. อัปโหลดจาก Base64 (กรณีเพิ่มสนามใหม่)
      if (base64Images && base64Images.length > 0) {
          for (let base64Image of base64Images) {
              const result = await cloudinary.uploader.upload(base64Image, { folder: "substadium" });
              images.push(result.secure_url);
          }
      }

      // ✅ 2. อัปโหลดจาก Multer (กรณีเลือกไฟล์)
      if (req.files && req.files.length > 0) {
          for (let file of req.files) {
              const result = await cloudinary.uploader.upload(file.path, { folder: "substadium" });
              images.push(result.secure_url);
          }
      }

      // ✅ บันทึก owner_id ลงในฐานข้อมูล
      const newSubStadium = new SubStadium({ 
          arenaId, sportId, name, description, intendant, phone, 
          openTime, closeTime, price, status, images, owner_id
      });

      const savedSubStadium = await newSubStadium.save();
      res.status(201).json({ message: "✅ เพิ่มสนามย่อยสำเร็จ", subStadium: savedSubStadium });
  } catch (error) {
      console.error("❌ ไม่สามารถเพิ่มสนามย่อย:", error);
      res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการเพิ่มสนามย่อย", error });
  }
};


  

// ✅ อัปเดตข้อมูลสนามย่อย (อัปเดตรูป + บันทึกลิงก์ใหม่)
exports.updateSubStadium = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("📌 อัปเดตสนาม ID:", id);
        console.log("📦 Data ที่ได้รับจาก Frontend:", req.body);

        if (!id) {
            console.log("❌ ไม่มี ID ถูกส่งมา");
            return res.status(400).json({ message: "❌ กรุณาส่งค่า ID" });
        }

        const updatedFields = req.body; // ✅ ใช้ค่า req.body ทั้งหมด

        // ✅ ใช้ findByIdAndUpdate และคืนค่าข้อมูลใหม่
        const updatedSubStadium = await SubStadium.findByIdAndUpdate(
            id,
            { $set: updatedFields }, // ✅ อัปเดตเฉพาะฟิลด์ที่ถูกส่งมา
            { new: true } // ✅ คืนค่าข้อมูลที่อัปเดตแล้ว
        );

        if (!updatedSubStadium) {
            console.log("❌ ไม่พบสนามย่อย ID:", id);
            return res.status(404).json({ message: "❌ ไม่พบสนามย่อย" });
        }

        console.log("✅ ข้อมูลหลังอัปเดต:", updatedSubStadium);

        res.status(200).json({ message: "✅ อัปเดตสนามย่อยสำเร็จ", subStadium: updatedSubStadium });
    } catch (error) {
        console.error("❌ ไม่สามารถอัปเดตสนามย่อย:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการอัปเดต", error });
    }
};



exports.deleteSubStadium = async (req, res) => {
  try {
      const { id } = req.params;
      const { owner_id } = req.body;

      console.log("🗑️ ลบสนาม ID:", id, "โดย owner_id:", owner_id); // ✅ Debug

      if (!owner_id) {
          return res.status(400).json({ message: "❌ owner_id is required" });
      }

      const subStadium = await SubStadium.findById(id);
      if (!subStadium) {
          return res.status(404).json({ message: "❌ ไม่พบสนามย่อย" });
      }

      console.log("🔍 ข้อมูลสนาม:", subStadium); // ✅ Debug - ดูว่ามี owner_id จริงไหม

      // ✅ ตรวจสอบว่ามี `owner_id` ก่อนเรียก `.toString()`
      if (!subStadium.owner_id) {
          return res.status(500).json({ message: "❌ ข้อมูลสนามไม่มี owner_id" });
      }

      if (subStadium.owner_id.toString() !== owner_id) {
          return res.status(403).json({ message: "❌ คุณไม่มีสิทธิ์ลบสนามนี้" });
      }

      await SubStadium.findByIdAndDelete(id);
      res.status(200).json({ message: "✅ ลบสนามย่อยสำเร็จ" });
  } catch (error) {
      console.error("❌ ไม่สามารถลบสนามย่อย:", error);
      res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการลบสนามย่อย", error });
  }
};

// ✅ ดึงข้อมูลสนามย่อยตาม ID
exports.getSubStadiumDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;
        console.log("📌 ดึงข้อมูลสนาม ID:", id, "วันที่:", date);

        const subStadium = await SubStadium.findById(id);
        if (!subStadium) {
            return res.status(404).json({ message: "❌ ไม่พบสนามย่อย" });
        }

        const selectedDate = date || moment().format("YYYY-MM-DD");

        // ✅ ดึงเวลาที่ถูกจองและยืนยันแล้ว
        const confirmedBookings = await BookingHistory.find({
            "details.subStadiumId": id,
            "details.bookingDate": selectedDate,
            status: "confirmed",
        });

        const reservedSlots = confirmedBookings.flatMap((booking) =>
            booking.details
                .filter((detail) => detail.subStadiumId.toString() === id)
                .flatMap((detail) => {
                    const startHour = parseInt(detail.startTime.split(":")[0]);
                    const endHour = parseInt(detail.endTime.split(":")[0]);
                    let slots = [];
        
                    for (let hour = startHour; hour < endHour; hour++) {
                        let nextHour = (hour + 1) % 24;
                        slots.push(`${hour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`);
                    }
                    return slots;
                })
        );

        // ✅ ดึงเวลาที่อยู่ระหว่างรอชำระเงิน (pending)
        const pendingBookings = await BookingHistory.find({
            "details.subStadiumId": id,
            "details.bookingDate": selectedDate,
            status: "pending",
            status: "paid",
        });

        const pendingSlots = pendingBookings.flatMap((booking) =>
            booking.details
                .filter((detail) => detail.subStadiumId.toString() === id)
                .flatMap((detail) => {
                    const startHour = parseInt(detail.startTime.split(":")[0]);
                    const endHour = parseInt(detail.endTime.split(":")[0]);
                    let slots = [];
        
                    for (let hour = startHour; hour < endHour; hour++) {
                        let nextHour = (hour + 1) % 24;
                        slots.push(`${hour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`);
                    }
                    return slots;
                })
        );

        // ✅ ดึงเวลาที่ถูกยกเลิก (canceled) และทำให้สามารถจองใหม่ได้
        const canceledBookings = await BookingHistory.find({
            "details.subStadiumId": id,
            "details.bookingDate": selectedDate,
            status: "canceled",
            status: "rejected",
        });

        const canceledSlots = canceledBookings.flatMap((booking) =>
            booking.details
                .filter((detail) => detail.subStadiumId.toString() === id)
                .map((detail) => `${detail.startTime} - ${detail.endTime}`)
        );

        console.log("✅ เวลาที่ถูกจอง (แดง):", reservedSlots);
        console.log("⏳ เวลาที่อยู่ระหว่างรอชำระเงิน (เหลือง):", pendingSlots);
        console.log("🟢 เวลาที่ยกเลิกแล้ว (จองได้):", canceledSlots);

        res.status(200).json({
            ...subStadium._doc,
            reservedSlots,
            pendingSlots,
            canceledSlots, // ✅ ส่งไปที่ Frontend เพื่อให้สามารถจองใหม่ได้
        });
    } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลสนามย่อย:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
    }
};