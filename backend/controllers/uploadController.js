const multer = require("multer");
const path = require("path");
const Image = require("../models/Image"); // ✅ ตรวจสอบว่าโมเดลนี้มีอยู่

// ✅ ตั้งค่า multer สำหรับจัดการไฟล์อัปโหลด
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ ไฟล์จะถูกเก็บในโฟลเดอร์ uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ✅ ตั้งชื่อไฟล์เป็น timestamp
  }
});

const upload = multer({ storage });

// ✅ ฟังก์ชันอัปโหลดรูปภาพ
exports.uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    const newImage = new Image({
      filename: req.file.filename,
      url: imageUrl
    });

    await newImage.save();
    res.status(201).json({ message: "Upload successful", imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Export multer `upload` object เพื่อใช้ใน Routes
exports.upload = upload;
