const multer = require("multer");
const path = require("path");
const Image = require("../models/Image"); // ✅ ตรวจสอบว่ามีโมเดลนี้จริง

// ✅ ตั้งค่า `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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

  try {
    const newImage = new Image({
      filename: req.file.filename,
      url: imageUrl
    });

    await newImage.save();
    res.status(201).json({ message: "✅ Upload successful", imageUrl });
  } catch (error) {
    console.error("❌ Error saving image to database:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ต้อง export `upload` ออกมา
exports.upload = upload;
