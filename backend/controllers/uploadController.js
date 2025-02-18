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
    return res.status(400).json({ message: "No file uploaded" });
  }

  const serverUrl = "http://localhost:4000"; // เปลี่ยนตาม backend ของคุณ
  const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;

  console.log("📸 Uploaded File:", req.file);
  res.status(200).json({ imageUrl });
};


// ✅ ต้อง export `upload` ออกมา
exports.upload = upload;
