const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User Model
const Owner = require("../models/BusinessOwner"); // Import BusinessOwner Model
const jwt = require("jsonwebtoken");
const secret = "MatchWeb";
require("dotenv").config();
const nodemailer = require("nodemailer");
const axios = require("axios")

exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const {
      email, password, firstName, lastName,
      gender, phoneNumber, birthdate, interestedSports, role,
      province, district, subdistrict
    } = req.body;

    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedBirthdate = new Date(birthdate);

    // ✅ รับ URL ของรูปจาก Cloudinary (ถ้ามี)
    const profileImage = req.file ? req.file.path : null;

    // ✅ ใช้ Google Maps API หา lat, lng
    const addressQuery = `${subdistrict}, ${district}, ${province}, Thailand`;
    const googleApiKey = process.env.GOOGLE_API; // 🔥 ใส่ API Key ของคุณที่นี่

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressQuery)}&key=${googleApiKey}`
      );

      if (response.data.status !== "OK" || !response.data.results.length) {
        return res.status(400).json({ message: "❌ ไม่สามารถดึงพิกัดจาก Google Maps ได้" });
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      const location = {
        type: "Point",
        coordinates: [lng, lat],
      };
      console.log("📌 อัปเดตพิกัดใหม่จาก Google Maps:", location);

      // ✅ สร้างบัญชีผู้ใช้
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
        location,
      });

      res.status(201).json({ message: "✅ สมัครสมาชิกสำเร็จ!", user: newUser });

    } catch (error) {
      console.error("❌ Error fetching geolocation from Google Maps:", error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตพิกัด" });
    }

  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ ตรวจสอบว่ามีการกรอกข้อมูลครบถ้วน
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูล
    const [existingUser, existingOwner] = await Promise.all([
      User.findOne({ email }), // ค้นหาใน Collection `users`
      Owner.findOne({ email }) // ค้นหาใน Collection `businessowners`
    ]);

    let exitResult = null;
    let userType = "";

    // ✅ ตรวจสอบประเภทของบัญชีที่ล็อกอิน
    if (existingUser) {
      exitResult = existingUser;
      userType = "user";
    } else if (existingOwner) {
      exitResult = existingOwner;
      userType = "owner";
    }

    // 🚫 **บล็อกบัญชีที่ถูก Blacklist ไม่ให้เข้าสู่ระบบ**
    if (exitResult.status === "blacklisted") {
      return res.status(403).json({ 
        message: "บัญชีของคุณถูกระงับ ไม่สามารถเข้าสู่ระบบได้",
        errorType: "blacklisted_account" // 🔴 ประเภทของ Error
      });
    }

    // 🚫 **บล็อกบัญชีที่ถูก Blacklist ไม่ให้เข้าสู่ระบบ**
    if (exitResult.status === "blacklisted") {
      return res.status(403).json({ message: "บัญชีของคุณถูกระงับ ไม่สามารถเข้าสู่ระบบได้" });
    }

    // ✅ ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, exitResult.password);
    
    if (isPasswordValid) {
      // 🔑 สร้าง Token สำหรับล็อกอิน
      const token = jwt.sign(
        {
          email: exitResult.email,
          name: exitResult.firstName,
          id: exitResult._id,
          role: exitResult.role,
          userType: userType,
        },
        secret,
        { expiresIn: '1h' }
      );

      console.log("✅ เข้าสู่ระบบสำเร็จ");
      return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
    } else {
      console.log("❌ เข้าสู่ระบบไม่สำเร็จ: รหัสผ่านไม่ถูกต้อง");
      return res.status(401).json({ message: "เข้าสู่ระบบไม่สำเร็จ" });
    }
  } catch (err) {
    console.error("❌ Error Login user:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
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
    const { id } = req.params;
    let updateData = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
    }

    // ✅ ถ้าไม่มีไฟล์ใหม่ที่อัปโหลด จะไม่อัปเดต profileImage
    if (req.file) {
      updateData.profileImage = req.file.path;
    } else {
      updateData.profileImage = existingUser.profileImage; // ✅ ใช้รูปเดิม
    }

    // ✅ ตรวจสอบและอัปเดตตำแหน่ง (Lat/Lng) ถ้ามีการเปลี่ยนแปลงที่อยู่
    if (updateData.province || updateData.district || updateData.subdistrict) {
      const addressQuery = `${updateData.subdistrict}, ${updateData.district}, ${updateData.province}, Thailand`;
      const googleApiKey = process.env.GOOGLE_API;

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressQuery)}&key=${googleApiKey}`
        );

        if (response.data.status === "OK") {
          const { lat, lng } = response.data.results[0].geometry.location;
          updateData.location = {
            type: "Point",
            coordinates: [lng, lat],
          };
        } else {
          return res.status(400).json({ message: "❌ ไม่สามารถดึงพิกัดจาก Google Maps ได้" });
        }
      } catch (error) {
        console.error("❌ Error fetching geolocation:", error);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตพิกัด" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "✅ อัปเดตข้อมูลสำเร็จ!", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
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
      // ✅ ค้นหาผู้ใช้ใน `User` หรือ `Owner`
      let user = await User.findOne({ email });
      let owner = await Owner.findOne({ email });

      if (!user && !owner) {
          return res.status(404).json({ message: "❌ ไม่พบอีเมลนี้ในระบบ" });
      }

      // ✅ กำหนด `userId` และ `userType`
      const userId = user ? user._id : owner._id;
      const userType = user ? "user" : "owner";

      // ✅ สร้าง Token ที่มีอายุ 15 นาที
      const resetToken = jwt.sign({ id: userId, type: userType }, process.env.JWT_SECRET, { expiresIn: "15m" });

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
      // ✅ ถอดรหัส Token เพื่อดึง `userId` และ `userType`
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const userType = decoded.type; // ✅ ตรวจสอบว่าเป็น user หรือ owner

      // ✅ เข้ารหัสรหัสผ่านใหม่
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // ✅ อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
      if (userType === "user") {
          await User.findByIdAndUpdate(userId, { password: hashedPassword });
      } else if (userType === "owner") {
          await Owner.findByIdAndUpdate(userId, { password: hashedPassword });
      }

      return res.status(200).json({ message: "✅ เปลี่ยนรหัสผ่านสำเร็จ!" });

  } catch (error) {
      console.error("❌ Error resetting password:", error);
      return res.status(400).json({ message: "❌ ลิงก์หมดอายุหรือไม่ถูกต้อง" });
  }
};

exports.delete = async (req, res) => {
  console.log("✅ Delete Member Requested:", req.params.id);
  try {
    const userId = req.params.id;
    console.log("🗑️ กำลังปิดบัญชีผู้ใช้ ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "❌ ไม่ได้รับ userId" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: "inactive" },  // เปลี่ยนสถานะเป็น inactive
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ ไม่พบผู้ใช้ในระบบ" });
    }

    console.log("✅ บัญชีผู้ใช้ถูกปิด:", updatedUser);
    return res.status(200).json({ message: "บัญชีผู้ใช้ถูกปิดเรียบร้อย", updatedUser });
  } catch (error) {
    console.error("❌ Error disabling user:", error);
    return res.status(500).json({ message: "ปิดบัญชีผู้ใช้ไม่สำเร็จ" });
  }
};

