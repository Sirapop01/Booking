const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderModel: { type: String, enum: ["User", "BusinessOwner", "Admin", "SuperAdmin"], required: true },
  senderRole: { type: String, enum: ["customer", "owner", "admin", "superadmin"], required: true },

  receiverId: { type: mongoose.Schema.Types.ObjectId, default: null }, // ✅ อนุญาตให้เป็น null
  receiverModel: { type: String, enum: ["User", "BusinessOwner", "Admin", "SuperAdmin", "Group"], required: true },
  receiverRole: { type: String, enum: ["customer", "owner", "admin", "superadmin", "group"], required: true },

  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

// ✅ ต้อง export โมเดลให้ถูกต้อง
module.exports = mongoose.model("Chat", chatSchema);
