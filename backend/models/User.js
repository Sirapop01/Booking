const mongoose = require("mongoose");

// สร้าง Schema สำหรับ User
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, }, // ✅ เพิ่ม gender
  phoneNumber: { type: String, required: true },
  birthdate: { type: Date, required: true }, // ✅ เปลี่ยนให้ตรงกับ formData
  interestedSports: { type: String },
  province: { type: String, required: true },
  district: { type: String, required: true },
  subdistrict: { type: String, required: true },
  role: { type: String, required: true }, // ✅ แก้คำผิด
  profileImage: { type: String, required: false }, // ✅ เปลี่ยนเป็น required: false กรณีไม่มีอัปโหลด
  status: { type: String, default: "active" } // "active" หรือ "blacklisted"
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
