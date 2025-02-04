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

// ✅ ฟังก์ชันอัปโหลดรูปโปรไฟล์
exports.uploadProfileImage = async (req, res) => {
  console.log("📂 File Upload Request:", req.file); // ✅ Debugging

  if (!req.file) {
    return res.status(400).json({ error: "❌ No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(201).json({ message: "✅ Upload successful", imageUrl });
};

// ✅ ฟังก์ชันอัปโหลดรูปสนามกีฬา
exports.uploadArenaImage = async (req, res) => {
  console.log("📂 Arena Image Upload Request:", req.file); // ✅ Debugging

  if (!req.file) {
    return res.status(400).json({ error: "❌ No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(201).json({ message: "✅ Upload successful", imageUrl });
};

// ✅ ต้อง export `upload` ออกมา
exports.upload = upload;
