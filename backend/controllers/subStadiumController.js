const SubStadium = require("../models/subStadiumModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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
      const { owner_id } = req.query; // ✅ รับ owner_id จาก query params (optional)

      let query = { arenaId, sportId };
      if (owner_id) {
          query.owner_id = owner_id; // ✅ กรองเฉพาะสนามที่เป็นของ owner_id นี้
      }

      const subStadiums = await SubStadium.find(query);
      res.status(200).json(subStadiums);
  } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลสนามย่อย:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
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
      const { owner_id } = req.body;
      let updatedData = req.body;
      let images = [];

      if (!owner_id) {
          return res.status(400).json({ message: "❌ owner_id is required" });
      }

      const existingSubStadium = await SubStadium.findById(id);
      if (!existingSubStadium) {
          return res.status(404).json({ message: "❌ ไม่พบสนามย่อย" });
      }

      if (existingSubStadium.owner_id.toString() !== owner_id) {
          return res.status(403).json({ message: "❌ คุณไม่มีสิทธิ์แก้ไขสนามนี้" });
      }

      if (req.files && req.files.length > 0) {
          for (let file of req.files) {
              const result = await cloudinary.uploader.upload(file.path, { folder: "substadium" });
              images.push(result.secure_url);
          }
          updatedData.images = images;
      }

      const updatedSubStadium = await SubStadium.findByIdAndUpdate(id, updatedData, { new: true });
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



