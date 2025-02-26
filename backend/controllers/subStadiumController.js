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
    const subStadiums = await SubStadium.find({ arenaId, sportId });
    res.status(200).json(subStadiums);
  } catch (error) {
    console.error("❌ ไม่สามารถดึงข้อมูลสนามย่อย:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

// ✅ เพิ่มสนามย่อยใหม่ (พร้อมบันทึกลิงก์รูป)
exports.createSubStadium = async (req, res) => {
    try {
      const { arenaId, sportId, name, description, owner, phone, openTime, closeTime, price, status, images: base64Images } = req.body;
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

      // ✅ สร้างสนามใหม่และบันทึกลง MongoDB
      const newSubStadium = new SubStadium({ 
        arenaId, sportId, name, description, owner, phone, openTime, closeTime, price, status, images 
      });

      const savedSubStadium = await newSubStadium.save();
      res.status(201).json({ message: "เพิ่มสนามย่อยสำเร็จ", subStadium: savedSubStadium });
    } catch (error) {
      console.error("❌ ไม่สามารถเพิ่มสนามย่อย:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มสนามย่อย", error });
    }
};

  

// ✅ อัปเดตข้อมูลสนามย่อย (อัปเดตรูป + บันทึกลิงก์ใหม่)
exports.updateSubStadium = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      let images = [];
  
      if (req.files && req.files.length > 0) {
        for (let file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "substadium" });
          images.push(result.secure_url); // ✅ บันทึกลิงก์รูปใหม่
        }
        updatedData.images = images; // ✅ อัปเดตภาพใน MongoDB
      }
  
      const updatedSubStadium = await SubStadium.findByIdAndUpdate(id, updatedData, { new: true });
  
      res.status(200).json({ message: "อัปเดตสนามย่อยสำเร็จ", subStadium: updatedSubStadium });
    } catch (error) {
      console.error("❌ ไม่สามารถอัปเดตสนามย่อย:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต", error });
    }
  };
  

  exports.deleteSubStadium = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("🔍 รับค่า ID:", id); // ✅ ตรวจสอบค่า ID ที่รับจาก React
      if (!id) {
        return res.status(400).json({ message: "❌ ID ไม่ถูกต้อง" });
      }
  
      const deletedSubStadium = await SubStadium.findByIdAndDelete(id);
      if (!deletedSubStadium) {
        return res.status(404).json({ message: "ไม่พบสนามย่อย" });
      }
  
      res.status(200).json({ message: "ลบสนามย่อยสำเร็จ" });
    } catch (error) {
      console.error("❌ ไม่สามารถลบสนามย่อย:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบสนามย่อย" });
    }
  };
  
  
  
