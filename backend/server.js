// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000; // พอร์ตที่ต้องการให้ Backend รัน

// ใช้ body-parser เพื่ออ่าน JSON (หรือใช้ express.json() แทนก็ได้)
app.use(bodyParser.json());

// สร้าง Transporter สำหรับส่งเมล (ใช้ Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sirapop0122@gmail.com", // ใส่ Gmail ของคุณ
    pass: "Pupa_22012547"         // ใส่รหัสผ่าน หรือ App Password
  },
});

app.post("/api/send-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "ไม่มีอีเมลที่ส่งมา" });
    }

    const mailOptions = {
      from: "sirapop0122@gmail.com",           // อีเมลผู้ส่ง
      to: email,                              // อีเมลผู้รับ (ที่กรอกจาก Frontend)
      subject: "Password Reset",
      text: "ลิงก์สำหรับเปลี่ยนรหัสผ่าน: http://localhost:3000/changepassword"
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "ส่งอีเมลสำเร็จ" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
