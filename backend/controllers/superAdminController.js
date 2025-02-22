const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SuperAdmin = require("../models/SuperAdmin");


exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    // 🔍 แปลง Email เป็นตัวเล็กทั้งหมดก่อนค้นหา
    const superAdmin = await SuperAdmin.findOne({ email: email });
    console.log(superAdmin)
    if (!superAdmin) {
      return res.status(400).json({ message: "ไม่พบ Super Admin" });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign({ id: superAdmin._id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ!",
      token,
      user: { email: superAdmin.email, role: "superadmin" }
    });

  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

