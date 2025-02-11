const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User Model
const BusinessOwner = require("../models/BusinessOwner"); // Import BusinessOwner Model
const jwt = require("jsonwebtoken");
const secret = "MatchWeb";
require("dotenv").config();
const nodemailer = require("nodemailer");


exports.register = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName,
      gender, phoneNumber, birthdate, interestedSports,
      province, district, subdistrict, profileImage, role, location
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedBirthdate = new Date(birthdate);

    // สร้างผู้ใช้ใหม่
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      phoneNumber,
      birthdate: formattedBirthdate,
      interestedSports,
      province,
      district,
      subdistrict,
      profileImage,
      role: role || "customer",
      location  // ✅ ตรวจสอบว่ารูปแบบ location ถูกต้อง
    });

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", user: newUser });

  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error: err.message });
  }
};



exports.login = async (req, res) => {

  try {
    const { email, password, } = req.body;

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password == null || email == null) {
      return res.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const [existingUser, existingOwner] = await Promise.all([
      User.findOne({ email }), // ค้นหาใน Collection `users`
      BusinessOwner.findOne({ email }) // ค้นหาใน Collection `businessowners`
    ]);

    let exitResult = null;

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (existingUser) {
      exitResult = existingUser;
    } else if (existingOwner) {
      exitResult = existingOwner;
    }

    // ถ้าไม่พบผู้ใช้ในระบบ
    if (!exitResult) {
      return res.status(401).json({ message: "ไม่พบผู้ใช้ในระบบ" });
    }

    const LoginOK = await bcrypt.compare(password, exitResult.password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("รหัสผ่านที่ถูกเข้ารหัสใหม่:", hashedPassword);

    if (LoginOK) {
      const name = exitResult.firstName;
      const id = exitResult._id;
      const role = exitResult.role;
      const token = jwt.sign({ email, name, id, role }, secret, { expiresIn: '1h' })

      //password 123456
      console.log("เข้าสู่ระบบสำเร็จ");
      return res.json({ message: "เข้าสู่ระบบสำเร็จ", token }

      );
    } else {
      console.log("เข้าสู่ระบบไม่สำเร็จ");
      return res.json({ message: "เข้าสู่ระบบไม่สำเร็จ" });
    }

  } catch (err) {
    console.error("Error Login user:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

exports.getMB = async (req, res) => {
  console.log("✅ GET Member Requested:", req.params.id);
  try {
    const userData = await User.findById(req.params.id);  // ✅ ใช้ findById() แทน findOne()

    if (!userData) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    return res.status(500).json({ message: "เกิดปัญหาในระบบ" });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "ไม่สามารถออกจากระบบได้" });
        }
      });
    }
    console.log("✅ Logout API Called");
    res.clearCookie("connect.sid"); // ✅ แก้ชื่อให้ถูกต้อง
    return res.status(200).json({ message: "ออกจากระบบเสร็จสิ้น" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return res.status(500).json({ message: "เกิดปัญหาในระบบ" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // รับ ID จาก URL
    const updateData = req.body; // ข้อมูลที่ส่งมาอัปเดต

    // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      message: "✅ อัปเดตข้อมูลสำเร็จ!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "ไม่มีไฟล์ที่อัปโหลด" });
    }

    const profileImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(id, { profileImage }, { new: true });

    res.status(200).json({ message: "อัปโหลดรูปภาพสำเร็จ!", profileImage });
  } catch (error) {
    console.error("❌ Error updating profile image:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตรูปภาพ" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ API ส่งลิงก์ Reset Password ไปยังอีเมล
exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "❌ ไม่พบอีเมลนี้ในระบบ" });
    }

    // ✅ สร้าง Token ที่มีอายุ 15 นาที
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // ✅ สร้างลิงก์ Reset Password โดยแนบ Token
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // ✅ ส่งอีเมลแจ้งเตือน
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔑 รีเซ็ตรหัสผ่านของคุณ",
      html: `<p>คุณได้รับคำขอรีเซ็ตรหัสผ่าน</p>
             <p>กดที่ลิงก์ด้านล่างเพื่อเปลี่ยนรหัสผ่านใหม่:</p>
             <a href="${resetLink}" target="_blank">${resetLink}</a>
             <p>ลิงก์นี้จะหมดอายุภายใน 15 นาที</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "✅ กรุณาตรวจสอบอีเมลของคุณ" });

  } catch (error) {
    console.error("❌ Error sending reset password email:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
};

// ✅ API รีเซ็ตรหัสผ่าน
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // ✅ ถอดรหัส Token เพื่อดึง userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ✅ เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ message: "✅ เปลี่ยนรหัสผ่านสำเร็จ!" });

  } catch (error) {
    console.error("❌ Error resetting password:", error);
    return res.status(400).json({ message: "❌ ลิงก์หมดอายุหรือไม่ถูกต้อง" });
  }
};