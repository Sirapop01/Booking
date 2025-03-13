const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String },
  phoneNumber: { type: String, required: true },
  birthdate: { type: Date },
  interestedSports: { type: String },
  province: { type: String, required: true },
  district: { type: String, required: true },
  subdistrict: { type: String, required: true },
  profileImage: { type: String },
  role: { type: String, default: 'customer' },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  status: { type: String, enum: ["active", "blacklisted"], default: "active" }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
