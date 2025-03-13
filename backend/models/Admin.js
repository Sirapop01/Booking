const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  birthdate: Date,
  idCardNumber: { type: String, required: true }, // 👈 เพิ่มตรงนี้
  profileImage: String,
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admins", AdminSchema);
