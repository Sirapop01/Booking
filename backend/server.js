const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config(); // ✅ ใช้ .env สำหรับ MONGO_URI

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes");
const businessRoutes = require("./routes/businessRoutes");
const manageAccountRoutes = require("./routes/manageAccountRoutes");
const arenaRoutes = require("./routes/arenaRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const verifyPaymentRoutes = require("./routes/verifyPaymentRoutes"); // ✅ ตรวจสอบ Route
const businessInfoRoutes = require('./routes/businessInfoRoutes');
const businessOwnerRoutes = require("./routes/businessOwnerRoutes");
const LedgerRoutes = require("./routes/ledgerRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminLedgerRoutes = require("./routes/adminLedgerRoutes");
const stadiumlistRoutes = require("./routes/stadiumlistRoutes");
const sportRoutes = require("./routes/sportRoutes");
const app = express();
const PORT = process.env.PORT || 4000;
const promotionRoutes = require("./routes/promotionRoutes");

// เสิร์ฟไฟล์ภาพจากโฟลเดอร์ uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Middleware
app.use(bodyParser.json());
// ✅ แก้ไข CORS ให้รองรับหลายพอร์ต
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],  // ✅ อนุญาต Frontend หลายพอร์ต
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // ✅ อนุญาตเมธอดต่าง ๆ
  allowedHeaders: ['Content-Type', 'Authorization'],  // ✅ อนุญาตการส่ง Authorization Header
  credentials: true  // ✅ อนุญาตส่ง Cookies หรือ Headers ที่เกี่ยวกับ Authentication
}));
app.use("/uploads", express.static("uploads")); // ✅ ให้สามารถเข้าถึงไฟล์ใน `uploads/` ได้จาก URL fix
app.use("/api/business-owners", businessOwnerRoutes);

// ✅ เชื่อมต่อ MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/BookingDB"; // ✅ ต้องกำหนด Database Name
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ กำหนด API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stadiums", stadiumRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/manage-account", manageAccountRoutes);
app.use("/api/arenas", arenaRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/verify-payments", verifyPaymentRoutes);
app.use("/api/business-info", businessInfoRoutes);
app.use("/api/ledger", LedgerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/admin-ledger", adminLedgerRoutes);
app.use("/api/stadium",stadiumlistRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/promotions", promotionRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
