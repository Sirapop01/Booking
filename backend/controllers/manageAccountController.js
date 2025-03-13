const User = require("../models/User");
const Owner = require("../models/BusinessOwner");
const Blacklist = require("../models/Blacklist"); // เพิ่ม Model Blacklist
const Arena = require("../models/Arena"); // ✅ Import Arena Model

// 📌 ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error });
  }
};

// 📌 ฟังก์ชันดึงข้อมูลเจ้าของสนามทั้งหมด
exports.getOwners = async (req, res) => {
  try {
    const owners = await Owner.find().select("-password");
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลเจ้าของสนาม", error });
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

// 📌 ดึงข้อมูลเจ้าของสนามตาม ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id).select("-password");
    if (!owner) return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหาเจ้าของสนาม", error });
  }
};

// 📌 ดึงรายการสนามของเจ้าของสนาม
exports.getStadiumsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    console.log("📌 กำลังดึงข้อมูลสนามของ Owner ID:", ownerId);

    // ✅ ตรวจสอบว่า ownerId ถูกต้อง
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      console.log("❌ ไม่พบเจ้าของสนามในระบบ!");
      return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    }

    console.log("✅ พบเจ้าของสนาม:", owner.fullName);

    // ✅ ค้นหาสนามที่เป็นของ businessOwnerId
    const stadiums = await Arena.find({ businessOwnerId: ownerId });

    console.log("✅ จำนวนสนามที่พบ:", stadiums.length);
    res.json(stadiums);
  } catch (error) {
    console.error("❌ Error fetching stadiums:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสนาม", error: error.message });
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

// 📌 ลบบัญชีเจ้าของสนาม
exports.deleteOwner = async (req, res) => {
  try {
    const deletedOwner = await Owner.findByIdAndDelete(req.params.id);
    if (!deletedOwner) return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });

    res.json({ message: "ลบบัญชีเจ้าของสนามเรียบร้อย" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล", error });
  }
};

// 📌 ตั้ง/ยกเลิก Blacklist ผู้ใช้
exports.toggleBlacklistUser = async (req, res) => {
  try {
    console.log("📌 รับค่า req.params.id:", req.params.id);
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const blacklistEntry = await Blacklist.findOne({ accountId: user._id });

    if (!blacklistEntry) {
      console.log("📌 เพิ่มเข้าสู่ Blacklist:", user._id);
      await Blacklist.create({ 
        accountId: user._id, 
        userType: "User", 
        reason: req.body.reason || "ละเมิดเงื่อนไข" 
      });

      await User.findByIdAndUpdate(user._id, { status: "blacklisted" }, { new: true, runValidators: false });
      return res.json({ message: "บัญชีถูกเพิ่มใน Blacklist" });
    } else {
      console.log("📌 เอาออกจาก Blacklist:", user._id);
      await Blacklist.findByIdAndDelete(blacklistEntry._id);

      await User.findByIdAndUpdate(user._id, { status: "active" }, { new: true, runValidators: false });
      return res.json({ message: "บัญชีถูกปลดจาก Blacklist" });
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Blacklist:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Blacklist", error: error.message });
  }
};

// 📌 ตั้ง/ยกเลิก Blacklist เจ้าของสนาม (แก้ไขให้ถูกต้อง)
exports.toggleBlacklistOwner = async (req, res) => {
  try {
    console.log("📌 รับค่า req.params.id:", req.params.id);
    
    const owner = await Owner.findById(req.params.id); // ✅ แก้จาก User เป็น Owner
    if (!owner) return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });

    const blacklistEntry = await Blacklist.findOne({ accountId: owner._id });

    if (!blacklistEntry) {
      console.log("📌 เพิ่มเข้าสู่ Blacklist:", owner._id);
      await Blacklist.create({ 
        accountId: owner._id, 
        userType: "BusinessOwner", 
        reason: req.body.reason || "ละเมิดเงื่อนไข" 
      });

      await Owner.findByIdAndUpdate(owner._id, { status: "blacklisted" }, { new: true, runValidators: false });
      return res.json({ message: "บัญชีเจ้าของสนามถูกเพิ่มใน Blacklist" });
    } else {
      console.log("📌 เอาออกจาก Blacklist:", owner._id);
      await Blacklist.findByIdAndDelete(blacklistEntry._id);

      await Owner.findByIdAndUpdate(owner._id, { status: "active" }, { new: true, runValidators: false });
      return res.json({ message: "บัญชีเจ้าของสนามถูกปลดจาก Blacklist" });
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Blacklist:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Blacklist", error: error.message });
  }
};
