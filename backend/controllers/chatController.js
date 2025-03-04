const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/User");
require("dotenv").config(); // โหลดค่า ENV

const JWT_SECRET = process.env.JWT_SECRET || "MatchWeb"; // ใช้ค่าใน ENV

// ✅ ฟังก์ชันตรวจสอบ Token และสิทธิ์ Admin
const verifyAdmin = (req) => {
  const token = req.header("Authorization");
  console.log("🔍 Token received in Backend:", token); // Debug Token
  
  if (!token) throw new Error("Access Denied! No token provided.");

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET); // ✅ ใช้ JWT_SECRET ที่กำหนด
    console.log("✅ Token Decoded:", decoded);

    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      throw new Error("Permission Denied! Admin only.");
    }
    return decoded;
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    throw new Error("Invalid Token!");
  }
};

// ✅ ดึงรายชื่อผู้ใช้ที่มีแชท (เฉพาะ Admin)
exports.getUsersWithChat = async (req, res) => {
  try {
    console.log("📡 API /chat-users called");
    const users = await Chat.aggregate([
      { $group: { _id: "$userId" } },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "userData"
        }
      },
      { $unwind: "$userData" },
      {
        $project: {
          _id: "$userData._id",
          firstName: "$userData.firstName",
          lastName: "$userData.lastName",
          email: "$userData.email"
        }
      }
    ]);

    console.log("✅ Users found:", users);
    res.json(users);
  } catch (error) {
    console.error("❌ Error in /chat-users:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// ✅ ดึงประวัติแชทของผู้ใช้ (เฉพาะ Admin)
exports.getChatHistory = async (req, res) => {
  try {
    const admin = verifyAdmin(req); // ✅ ตรวจสอบสิทธิ์
    console.log(`🔍 Admin ${admin.id} is fetching chat history for user ${req.params.userId}`);

    const { userId } = req.params;

    const messages = await Chat.find({ userId })
      .populate("userId", "firstName lastName email") // ✅ ดึงข้อมูลผู้ใช้มาด้วย
      .populate("adminId", "firstName lastName email")
      .sort("timestamp");

    if (!messages.length) {
      console.warn("⚠️ No chat history found for user:", userId);
      return res.status(404).json({ error: "No chat history found." });
    }

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching chat history:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ส่งข้อความแชท (เฉพาะ Admin)
exports.sendMessage = async (req, res) => {
  try {
    const admin = verifyAdmin(req); // ✅ ตรวจสอบสิทธิ์
    console.log(`✉️ Admin ${admin.id} is sending a message to user ${req.params.userId}`);

    const { userId } = req.params;
    const { sender, content } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      console.warn("⚠️ User not found:", userId);
      return res.status(404).json({ error: "User not found." });
    }

    if (!content || content.trim() === "") {
      console.warn("⚠️ Message content is empty.");
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const newMessage = new Chat({
      userId,
      adminId: admin.id, // ✅ เพิ่ม adminId เพื่อเชื่อมโยง Admin ที่ส่งข้อความ
      sender,
      content,
    });

    await newMessage.save();
    console.log("✅ Message sent:", newMessage);

    res.json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    res.status(500).json({ error: error.message });
  }
};