const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ สมัคร Admin (เฉพาะ SuperAdmin)
exports.registerAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      birthdate,
      idCardNumber, // 👈 เพิ่มตรงนี้
    } = req.body;

    // 🔍 เช็คข้อมูลที่จำเป็น
    if (!email || !password || !firstName || !lastName || !phoneNumber || !birthdate || !idCardNumber) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }

    // 🔍 เช็คว่ามีอีเมลซ้ำไหม
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    }

    // 🔐 เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 สร้าง Admin ใหม่
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      birthdate: new Date(birthdate),
      idCardNumber, // 👈 เพิ่มตรงนี้
      profileImage: req.file ? req.file.filename : null,
    });

    await newAdmin.save();

    res.status(201).json({ message: "สมัคร Admin สำเร็จ", admin: newAdmin });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", error: error.message });
  }
};

