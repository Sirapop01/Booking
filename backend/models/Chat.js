const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: "adminType" // ✅ Dynamic Reference
  },
  adminType: { 
    type: String, 
    enum: ["User", "SuperAdmin"], // ✅ สามารถเป็นได้ทั้ง User และ SuperAdmin
    required: true 
  },
  sender: { 
    type: String, 
    enum: ["admin", "superadmin", "user"], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Chat", chatSchema);

