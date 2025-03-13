const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema({
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: "userType", // สามารถอ้างอิงได้ทั้ง "User" และ "BusinessOwner"
    unique: true 
  },
  userType: { 
    type: String, 
    required: true, 
    enum: ["User", "BusinessOwner"] // ให้เลือกได้แค่ 2 ประเภท
  },
  reason: { type: String, required: true },
  status: { type: String, enum: ["blacklisted", "active"], default: "blacklisted" }, // ใช้ค่าดีฟอลต์เป็น blacklisted
  createdAt: { type: Date, default: Date.now }, // วันที่เพิ่มเข้า blacklist
  updatedAt: { type: Date, default: Date.now }  // วันที่อัปเดตล่าสุด
});

module.exports = mongoose.model("Blacklist", BlacklistSchema);
