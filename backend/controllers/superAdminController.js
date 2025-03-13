const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    let user = await SuperAdmin.findOne({ email });
    let role = "superadmin";

    if (!user) {
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(400).json({ message: "ไม่พบผู้ใช้งานในระบบ" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ!",
      token,
      user: { email: user.email, role }
    });

  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
