const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ✅ ตั้งค่า `Socket.io`
const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
app.set("io", io); // ✅ ส่ง `io` ไปให้ `chatController.js`

const PORT = process.env.PORT || 4000;

// ✅ Import Routes
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes");
const businessRoutes = require("./routes/businessRoutes");
const manageAccountRoutes = require("./routes/manageAccountRoutes");
const arenaRoutes = require("./routes/arenaRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const verifyPaymentRoutes = require("./routes/verifyPaymentRoutes");
const businessInfoRoutes = require('./routes/businessInfoRoutes');
const businessOwnerRoutes = require("./routes/businessOwnerRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminLedgerRoutes = require("./routes/adminLedgerRoutes");
const stadiumlistRoutes = require("./routes/stadiumlistRoutes");
const arenaManageRoutes = require("./routes/arenaManageRoutes");
const sportRoutes = require("./routes/sportRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const sportscategoriesRoutes = require("./routes/sportscategoriesRoutes");
const subStadiumRoutes = require("./routes/subStadiumRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const locationRoutes = require("./routes/locationRoutes");
const businessInfoRequestRoutes = require('./routes/businessInfoRequestRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const bookingHistoryRoutes = require("./routes/bookingHistoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ownerHistoryRoutes = require("./routes/ownerHistoryRoutes");


// ✅ กำหนด CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// ✅ เชื่อมต่อ MongoDB
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ✅ ตั้งค่า API Routes
console.log("🟢 Chat Routes Loaded");
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stadiums", stadiumRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/manage-account", manageAccountRoutes);
app.use("/api/arenas", arenaRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/verify-payments", verifyPaymentRoutes);
app.use("/api/business-info", businessInfoRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/admin-ledger", adminLedgerRoutes);
app.use("/api/stadium", stadiumlistRoutes);
app.use("/api/arena-manage", arenaManageRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/sportscategories", sportscategoriesRoutes);
app.use("/api/substadiums", subStadiumRoutes);
app.use("/api/favoritearena", favoriteRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/business-info-requests", businessInfoRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookinghistories", bookingHistoryRoutes);
app.use("/api/businessOwners", businessOwnerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/owner-history", ownerHistoryRoutes); // ✅ ต้องมี

// ✅ WebSocket สำหรับ Chat (Socket.io)
io.on("connection", (socket) => {
  console.log(`✅ New user connected: ${socket.id}`);

  // ✅ ให้ User Join Room ตาม ID ของตัวเอง
  socket.on("joinRoom", ({ userId }) => {
    if (userId) {
      socket.join(userId);
      console.log(`👥 User ${userId} joined room: ${userId}`);
    }
  });

  socket.on("sendMessage", (data) => {
    console.log("📩 New message:", data);

    // ✅ ตรวจสอบ receiverId ก่อนส่ง
    if (data.receiverId) {
      console.log(`📤 Sending message to Room: ${data.receiverId}`);
      io.to(data.receiverId).emit("receiveMessage", data);
    } else {
      console.log("⚠️ Missing receiverId, broadcasting to all users!");
      io.emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});


// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ เริ่มต้นเซิร์ฟเวอร์
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
