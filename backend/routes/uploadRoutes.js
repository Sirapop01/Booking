const express = require("express");
const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");

const router = express.Router();

// ตั้งค่า multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// อัปโหลดโปรไฟล์รูปและเก็บ URL ใน MongoDB
router.post("/uploadProfile", upload.single("profileImage"), async (req, res) => {
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
});

module.exports = router;
