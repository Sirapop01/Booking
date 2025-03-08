const nodemailer = require("nodemailer");
const BusinessOwner = require("../models/BusinessOwner"); // ✅ Import Model ที่ถูกต้อง
require("dotenv").config();

// ✅ ใช้ Google App Password แทนรหัสผ่านปกติ
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ✅ ต้องเป็น App Password
  },
});

// ✅ ฟังก์ชันส่งอีเมล
exports.sendEmailNotification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "กรุณาระบุ Email" });

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "การสมัครสมาชิกสำเร็จ",
      text: "ขอบคุณที่สมัครสมาชิกกับเรา! กรุณากรอกข้อมูลสนามของคุณ.",
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully!" });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "ไม่สามารถส่ง Email ได้", error: error.message });
  }
};

// ✅ ส่งอีเมลเมื่ออนุมัติ
exports.sendApprovalEmail = async (email, ownerName) => {
  try {
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `✅ สนามของคุณได้รับการอนุมัติ`,
          text: `ขอแสดงความยินดี! คุณ ${ownerName} สนามของคุณได้รับการอนุมัติเรียบร้อยแล้ว`
      };

      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error("❌ Error sending approval email:", error);
  }
};

// ❌ ส่งอีเมลเมื่อปฏิเสธ
exports.sendRejectionEmail = async (email, ownerName, reason) => {
  try {
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `🚫 สนามของคุณถูกปฏิเสธ`,
          text: `เรียนคุณ ${ownerName},\n\nขออภัย สนามของคุณถูกปฏิเสธเนื่องจาก: ${reason} \n\nกรุณาตรวจสอบข้อมูลและส่งคำขอใหม่หากต้องการ`
      };

      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error("❌ Error sending rejection email:", error);
  }
};

