const Chat = require("../models/Chat");
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const User = require("../models/User");
const BusinessOwner = require("../models/BusinessOwner");
const mongoose = require("mongoose");

// 📌 1. ส่งข้อความ (User → Admin Group)
exports.sendMessage = async (req, res) => {
  try {
    let { senderId, senderModel, senderRole, message } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newMessage = new Chat({
      senderId,
      senderModel,
      senderRole,
      receiverId: null,
      receiverModel: "Group",
      receiverRole: "admin",
      message,
    });

    await newMessage.save();
    console.log("✅ Message saved:", newMessage);

    const io = req.app.get("io");
    io.to("admins").emit("receiveMessage", newMessage);

    res.status(201).json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    console.log("📢 API getChatHistory Called with params:", req.params);

    let { userId, userModel } = req.params;

    if (!userId || !userModel || userId === "undefined") {
      return res.status(400).json({ success: false, message: "Missing or invalid parameters" });
    }

    console.log("🔍 Searching chat history for user:", { userId, userModel });

    const senderId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

    // ✅ ดึงประวัติแชททั้งหมดของ user รวมทั้งแชทที่ส่งไปหากลุ่มแอดมิน
    const chatHistory = await Chat.find({
      $or: [
        { senderId, senderModel: userModel },  // ดึงแชทที่ user เป็นคนส่ง
        { receiverId: senderId, receiverModel: userModel } // ดึงแชทที่ Admin ส่งถึง user หรือ owner
      ]
    }).sort({ timestamp: 1 });

    if (!chatHistory.length) {
      return res.status(404).json({ success: false, message: "No chat history found" });
    }

    console.log("📜 Retrieved Chat History:", chatHistory);

    res.status(200).json({ success: true, data: chatHistory });

  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// 📌 4. อัปเดตสถานะอ่านข้อความแล้ว
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ success: false, message: "Missing messageId" });
    }

    const updatedMessage = await Chat.findByIdAndUpdate(messageId, { isRead: true }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message marked as read", data: updatedMessage });
  } catch (error) {
    console.error("❌ Error marking message as read:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 5. ลบข้อความ
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId, userId } = req.params;

    if (!messageId || !userId) {
      return res.status(400).json({ success: false, message: "Missing messageId or userId" });
    }

    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this message" });
    }

    await Chat.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getChatUsers = async (req, res) => {
  try {
    console.log("📢 Fetching all chat users...");

    // ✅ ดึงเฉพาะผู้ใช้ที่เคยส่งข้อความถึง Admin หรือ SuperAdmin
    const chatUsers = await Chat.aggregate([
      {
        $match: {
          receiverRole: { $in: ["admin", "superadmin"] }, // ✅ ดึงแชทที่ส่งถึง Admin หรือ SuperAdmin
        },
      },
      {
        $group: {
          _id: "$senderId", // ✅ จัดกลุ่มตามผู้ส่ง (ลูกค้าหรือ Business Owner)
          userRole: { $first: "$senderRole" }, // ✅ ดึง Role ของผู้ส่ง
        },
      },
      {
        $lookup: {
          from: "users", // ✅ ค้นหาชื่อผู้ใช้จาก Collection Users
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "businessowners", // ✅ ค้นหาชื่อเจ้าของสนามจาก Collection BusinessOwners
          localField: "_id",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $project: {
          _id: 1,
          name: {
            $ifNull: [
              { $arrayElemAt: ["$userData.firstName", 0] },  // ✅ ใช้ firstName ถ้ามี
              { $arrayElemAt: ["$ownerData.firstName", 0] }, // ✅ ใช้ businessName ถ้ามี
              { $arrayElemAt: ["$userData.email", 0] }, // ✅ ใช้ email ถ้ามี
              "ไม่ทราบชื่อ", // ✅ ถ้าไม่มีทั้งหมดให้ใช้ "ไม่ทราบชื่อ"
            ],
          },
          email: { $ifNull: [{ $arrayElemAt: ["$userData.email", 0] }, { $arrayElemAt: ["$ownerData.email", 0] }] },
          role: "$userRole",
        },
      },
    ]);

    console.log("✅ Retrieved Chat Users:", chatUsers);

    if (!chatUsers.length) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, data: chatUsers });

  } catch (error) {
    console.error("❌ Error fetching chat users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// 📌 6. ดึง Admin คนแรก (ถ้าไม่มีออนไลน์)
exports.getAnyAdmin = async (req, res) => {
  try {
    console.log("📢 Fetching any available admin...");

    const admin = await Admin.findOne().sort({ createdAt: 1 });
    if (!admin) {
      console.log("❌ No Admin Found!");
      return res.status(404).json({ success: false, message: "No admin available" });
    }

    console.log("✅ Fallback Admin Found:", admin._id);
    return res.json({ success: true, receiverId: admin._id });

  } catch (error) {
    console.error("❌ Error fetching any admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 1. ส่งข้อความจาก Admin ไปยัง User หรือ BusinessOwner
exports.sendMessageToUserOrOwner = async (req, res) => {
  try {
    let { senderId, senderModel, senderRole, message, receiverId, receiverModel, receiverRole } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!senderId || !message || !receiverId || !receiverModel || !receiverRole) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // สร้างข้อความใหม่
    const newMessage = new Chat({
      senderId,
      senderModel,
      senderRole,
      receiverId, // receiverId คือผู้รับข้อความ (User หรือ BusinessOwner)
      receiverModel, // receiverModel เป็น "User" หรือ "BusinessOwner"
      receiverRole, // receiverRole คือ role ของผู้รับ (customer หรือ owner)
      message,
    });

    // บันทึกข้อความใหม่ในฐานข้อมูล
    await newMessage.save();
    console.log("✅ Message saved:", newMessage);

    // ส่งข้อความไปยังผู้รับที่ระบุ (ใช้ socket)
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("receiveMessage", newMessage); // ส่งข้อความไปยังผู้ใช้หรือเจ้าของสนาม

    res.status(201).json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
