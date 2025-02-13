const multer = require("multer");
const path = require("path");

// ✅ ตั้งค่า `multer` สำหรับการอัปโหลดรูป
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📂 เก็บไฟล์ไว้ในโฟลเดอร์ `uploads`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ให้ไม่ซ้ำ
  }
});

const upload = multer({ storage });

exports.uploadImage = (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  // ตรวจสอบไฟล์ที่อัปโหลด
  console.log('📸 Uploaded File:', req.file);

  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
};

// ✅ ต้อง export `upload` ออกมา
exports.upload = upload;
