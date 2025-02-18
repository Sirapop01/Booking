const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  phoneNumber: { type: String, required: true },
  birthdate: { type: Date, required: true },
  interestedSports: { type: String },
  province: { type: String, required: true },
  district: { type: String, required: true },
  subdistrict: { type: String, required: true },
  role: { type: String, required: true },
  profileImage: { type: String, required: false },

  // ✅ เพิ่มการจัดเก็บพิกัดตำแหน่งในรูปแบบ GeoJSON
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],  // ✅ ต้องเป็น [longitude, latitude]
      required: true
    }
  }
});

// ✅ สร้าง Index สำหรับ Geospatial Queries
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
