const User = require("../models/User");
const Owner = require("../models/BusinessOwner");
const Blacklist = require("../models/Blacklist"); // เพิ่ม Model Blacklist
const Arena = require("../models/Arena"); // ✅ Import Arena Model

const BookingHistory = require("../models/BookingHistory");
const Chat = require("../models/Chat");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const favoritearena = require("../models/favoriteModel")
const BusinessInfo = require("../models/BusinessInfo");
const BusinessInfoRequest = require("../models/BusinessInfoRequest");


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

// 📌 ฟังก์ชันลบบัญชีผู้ใช้ (ลบทุกข้อมูลที่เกี่ยวข้อง)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("🗑️ กำลังลบบัญชีผู้ใช้และข้อมูลที่เกี่ยวข้อง:", userId);

    // ✅ ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "❌ ไม่พบผู้ใช้ในระบบ" });
    }

    // 🔥 **ลบข้อมูลที่เกี่ยวข้องทั้งหมด**
    await Promise.all([
      BookingHistory.deleteMany({ userId }),  // ลบประวัติการจองทั้งหมดของผู้ใช้
      Chat.deleteMany({ senderId: userId }), // ลบข้อความแชทที่ผู้ใช้ส่ง
      Payment.deleteMany({ userId }), // ลบรายการชำระเงิน
      Review.deleteMany({ userId }), // ลบรีวิวของผู้ใช้
      Blacklist.deleteMany({ accountId: userId }), // ลบ blacklist ถ้ามี
      favoritearena.deleteMany({userId})
    ]);

    // 📌 ลบ User หลังจากข้อมูลทั้งหมดถูกลบแล้ว
    await User.findByIdAndDelete(userId);

    console.log("✅ ลบบัญชีและข้อมูลที่เกี่ยวข้องสำเร็จ!");
    return res.status(200).json({ message: "✅ บัญชีถูกลบเรียบร้อยแล้ว!" });

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการลบบัญชี", error: error.message });
  }
};

// 📌 ลบบัญชีเจ้าของสนาม
exports.deleteOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;

    // 🔹 ตรวจสอบก่อนว่า Owner มีอยู่จริงหรือไม่
    const existingOwner = await Owner.findById(ownerId);
    if (!existingOwner) {
      return res.status(404).json({ message: "❌ ไม่พบเจ้าของสนาม" });
    }

    console.log(`📌 กำลังลบข้อมูลที่เกี่ยวข้องกับ Owner ID: ${ownerId}`);

    // 🔥 1. ลบข้อมูลที่เกี่ยวข้องกับเจ้าของสนามก่อน
    const deletedChat = await Chat.deleteMany({ senderId: ownerId });
    console.log(`✅ ลบข้อความแชทสำเร็จ: ${deletedChat.deletedCount} รายการ`);

    const deletedBusinessInfo = await BusinessInfo.deleteMany({ businessOwnerId: ownerId });
    console.log(`✅ ลบ BusinessInfo สำเร็จ: ${deletedBusinessInfo.deletedCount} รายการ`);

    const deletedBusinessInfoRequest = await BusinessInfoRequest.deleteMany({ businessOwnerId: ownerId });
    console.log(`✅ ลบ BusinessInfoRequest สำเร็จ: ${deletedBusinessInfoRequest.deletedCount} รายการ`);

    // 🔥 2. ลบ Owner หลังจากที่ลบข้อมูลที่เกี่ยวข้องแล้ว
    const deletedOwner = await Owner.findByIdAndDelete(ownerId);
    console.log(`✅ ลบบัญชีเจ้าของสนามสำเร็จ: ${deletedOwner._id}`);

    return res.json({ message: "✅ ลบบัญชีเจ้าของสนามและข้อมูลที่เกี่ยวข้องเรียบร้อย" });

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการลบบัญชีเจ้าของสนาม:", error);
    return res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการลบข้อมูล", error: error.message });
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
