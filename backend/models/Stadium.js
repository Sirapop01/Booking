const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({
  owner_id: mongoose.Schema.Types.ObjectId, // ✅ อ้างถึงเจ้าของสนาม
  name: { type: String, required: true },
  location: String,
  phone: String,
  open_time: String,
  close_time: String,
  status: { type: String, default: "รอการยืนยัน" },
  open: { type: Boolean, default: true },
  image_url: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stadium", stadiumSchema);
