const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const newAdmin = new Admin({
      email,
      password,
      role: role || 'admin'
    });

    await newAdmin.save();

    res.status(201).json({ message: 'สร้าง Admin สำเร็จ', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    // ป้องกันไม่ให้ admin ลบ admin ด้วยกันเอง
    if (req.user.role === 'admin' && adminToDelete.role === 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบ Admin ระดับเดียวกัน' });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'ลบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};
