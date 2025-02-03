const User = require("../models/User");

// 📌 ดึงข้อมูลผู้ใช้ทั้งหมด (ไม่ส่ง password)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error });
  }
};

// 📌 ดึงข้อมูลผู้ใช้ตาม ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหาผู้ใช้", error });
  }
};

// 📌 ลบบัญชีผู้ใช้
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    res.json({ message: "ลบบัญชีเรียบร้อย" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล", error });
  }
};

// 📌 ตั้ง/ยกเลิก Blacklist ผู้ใช้
exports.toggleBlacklistUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    // เปลี่ยน status เป็น "blacklisted" หรือ "active"
    user.status = user.status === "blacklisted" ? "active" : "blacklisted";
    await user.save();

    res.json({ message: `บัญชี ${user.status === "blacklisted" ? "ถูกเพิ่มใน Blacklist" : "ถูกปลดจาก Blacklist"}` });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Blacklist", error });
  }
};
