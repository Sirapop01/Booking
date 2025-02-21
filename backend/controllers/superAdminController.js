const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SuperAdmin = require('../models/SuperAdmin');

exports.registerSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await SuperAdmin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email นี้มีอยู่แล้ว' });
    }

    const newAdmin = new SuperAdmin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'สมัคร Super Admin สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await SuperAdmin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, message: 'เข้าสู่ระบบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

exports.getSuperAdminProfile = async (req, res) => {
  try {
    const admin = await SuperAdmin.findById(req.user.id).select('-password');
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};
