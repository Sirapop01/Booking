const mongoose = require("mongoose");

// สร้าง Schema สำหรับ User
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  interestedSports: { type: String },
  province: { type: String, required: true },
  district: { type: String, required: true },
  subdistrict: { type: String, required: true },
  role: {type : String,requird: true }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
