const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ สมัคร Admin (เฉพาะ SuperAdmin)
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, birthdate } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      birthdate: new Date(birthdate),
      profileImage: req.files["profileImage"] ? req.files["profileImage"][0].path : null,
      idCardImage: req.files["idCardImage"] ? req.files["idCardImage"][0].path : null,
    });

    await newAdmin.save();
    res.status(201).json({ message: "✅ สมัคร Admin สำเร็จ!" });
  } catch (error) {
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error: error.message });
  }
};
