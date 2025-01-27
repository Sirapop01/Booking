// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("./model/User");

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // เปิดใช้ CORS

// เชื่อมต่อ MongoDB
mongoose.connect("mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/", { 
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "YOUR_GMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD" 
  },
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // หา user ใน DB
    const user = await User.findOne({ email });
    if (!user) {
      // เพื่อความปลอดภัย เราอาจตอบ 200 กลับไปเลย
      // ไม่บอกว่า "ไม่เจอ" (เพื่อไม่ให้คนเอามา brute force อีเมล)
      return res
        .status(200)
        .json({ message: "ถ้าอีเมลถูกต้อง ระบบจะส่งลิงก์รีเซ็ตให้ครับ" });
    }

    // สร้าง token แบบสุ่ม 32 bytes
    const resetToken = crypto.randomBytes(32).toString("hex");
    // (ถ้าต้องการเพิ่มความปลอดภัย อาจแฮช token ก่อนเก็บ เช่นใช้ crypto.createHash("sha256"))

    // กำหนดวันหมดอายุของ token (1 ชม. จากตอนนี้)
    const expires = Date.now() + 3600000; // 1 hour

    // บันทึก token และเวลาใน user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;
    await user.save();

    // สร้าง URL สำหรับหน้า Reset Password บน Frontend
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: "Sirapop0122@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `คุณได้ขอเปลี่ยนรหัสผ่าน กดลิงก์นี้เพื่อรีเซ็ต: ${resetUrl}`
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "ส่งอีเมลลิงก์รีเซ็ตแล้ว ถ้าอีเมลถูกต้องจะได้รับเมลนะครับ" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

// ตัวอย่าง Endpoint: Reset Password (หลังผู้ใช้คลิกลิงก์ในอีเมล)
app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // หา user ที่มี token ตรงกัน + token ยังไม่หมดอายุ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    // แฮชรหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // อัปเดต password + ลบ token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// อย่าลืมให้เซิร์ฟเวอร์เริ่มฟังบนพอร์ต (4000)
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


