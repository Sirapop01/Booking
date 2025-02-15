const User = require("../models/User"); // Import User Model
const BusinessOwner = require("../models/BusinessOwner"); // Import BusinessOwner Model
const bcrypt = require("bcryptjs");
require("dotenv").config();
const nodemailer = require("nodemailer");


exports.registerBusinessOwner = async (req, res) => {
    try {
        console.log("📩 Data received from Frontend:", req.body);

        const { email, password, firstName, lastName, phoneNumber, idCard, dob, role, acceptTerms } = req.body;

        // ✅ ค้นหาอีเมลจากทั้ง `users` และ `businessowners`
        const [existingUser, existingOwner] = await Promise.all([
            User.findOne({ email }), // ค้นหาใน Collection `users`
            BusinessOwner.findOne({ email }) // ค้นหาใน Collection `businessowners`
        ]);

        if (existingUser || existingOwner) {
            return res.status(400).json({
                success: false,
                message: "อีเมลนี้ถูกใช้ไปแล้วในระบบ!"
            });
        }

        // ✅ ค้นหา `idCard` ว่าซ้ำหรือไม่
        const existingIdCard = await BusinessOwner.findOne({ idCard });
        if (existingIdCard) {
            return res.status(400).json({
                success: false,
                message: "เลขบัตรประชาชนนี้ถูกใช้ไปแล้ว!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new BusinessOwner({
            email, password: hashedPassword, firstName, lastName, phoneNumber, idCard, dob, role, acceptTerms
        });

        console.log("✅ Creating new BusinessOwner:", newOwner);
        await newOwner.save();
        console.log("🎉 Data saved successfully!");

        res.status(201).json({
            success: true,
            message: "สมัครสมาชิกสำเร็จ! โปรดกรอกข้อมูลสนามและรอการอนุมัติ!"
        });

    } catch (error) {
        console.error("🚨 Error in register API:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
            error: error.message
        });
    }
};

// ✅ ค้นหา BusinessOwner ได้ทั้งจาก `id` หรือ `email`
exports.findBusinessOwner = async (req, res) => {
    try {
      const { id, email } = req.query;
  
      if (!id && !email) {
        return res.status(400).json({ message: "กรุณาใส่ ID หรือ Email" });
      }
  
      let query = {};
      if (id) query._id = id; // ✅ ค้นหาตาม `id`
      if (email) query.email = email; // ✅ ค้นหาตาม `email`
  
      const owner = await BusinessOwner.findOne(query);
  
      if (!owner) {
        return res.status(404).json({ message: "ไม่พบเจ้าของธุรกิจ" });
      }
  
      res.json({ 
        businessOwnerId: owner._id, 
        email: owner.email, 
        name: `${owner.firstName} ${owner.lastName}` 
      });
  
    } catch (error) {
      console.error("❌ Error fetching BusinessOwner:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
  };

  exports.getMB = async (req, res) => {
    console.log("✅ GET Member Requested:", req.params.id);
    try {
      const BusinessData = await BusinessOwner.findById(req.params.id);  // ✅ ใช้ findById() แทน findOne()
  
      if (!BusinessData) {
        return res.status(404).json({ message: "ไม่พบข้อมูล" });
      }
  
      return res.status(200).json(BusinessData);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      return res.status(500).json({ message: "เกิดปัญหาในระบบ" });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params; // รับ ID จาก URL
      const updateData = req.body; // ข้อมูลที่ส่งมาอัปเดต
  
      // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
      const existingUser = await BusinessOwner.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
      }
  
      // อัปเดตข้อมูลผู้ใช้
      const updatedUser = await BusinessOwner.findByIdAndUpdate(id, updateData, { new: true });
  
      return res.status(200).json({
        message: "✅ อัปเดตข้อมูลสำเร็จ!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
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
      const BusinessOwner = await BusinessOwner.findOne({ email });
  
      if (!BusinessOwner) {
        return res.status(404).json({ message: "❌ ไม่พบอีเมลนี้ในระบบ" });
      }
  
      // ✅ สร้าง Token ที่มีอายุ 15 นาที
      const resetToken = jwt.sign({ id: BusinessOwner._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  
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
      await BusinessOwner.findByIdAndUpdate(userId, { password: hashedPassword });
  
      return res.status(200).json({ message: "✅ เปลี่ยนรหัสผ่านสำเร็จ!" });
  
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      return res.status(400).json({ message: "❌ ลิงก์หมดอายุหรือไม่ถูกต้อง" });
    }
  };
