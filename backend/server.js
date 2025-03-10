const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // ✅ ใช้ .env สำหรับ MONGO_URI

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Import Routes
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
const favoriteRoutes = require("./routes/favoriteRoutes"); // ✅ เพิ่ม Route ของ Favorite
const locationRoutes = require("./routes/locationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const businessInfoRequestRoutes = require('./routes/businessInfoRequestRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const bookingHistoryRoutes = require("./routes/bookingHistoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


// ✅ กำหนด CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ ให้สามารถเข้าถึงไฟล์ใน `uploads/`

// ✅ เชื่อมต่อ MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/BookingDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB(); // ✅ เรียกใช้ฟังก์ชันเชื่อมต่อ MongoDB

// ✅ กำหนด API Routes
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
app.use("/api/favoritearena", favoriteRoutes); // ✅ เพิ่ม API Routes สำหรับ Favorite Arena
app.use("/api/location", locationRoutes);
app.use("/api/chat", chatRoutes); // ✅ ใช้ "/api/chat" แทน "/api" เพื่อให้ Route ชัดเจน
app.use("/api/favoritearena", favoriteRoutes);
app.use("/api/business-info-requests", businessInfoRequestRoutes);
app.use("/api", reviewRoutes);
app.use("/api/bookinghistories", bookingHistoryRoutes);
app.use("/api/businessOwners", businessOwnerRoutes);
app.use("/api/bookings", bookingRoutes);


// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
