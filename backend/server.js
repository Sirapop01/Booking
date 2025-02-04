const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // ✅ ใช้ .env สำหรับ MONGO_URI

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const businessRoutes = require("./routes/businessRoutes");
const manageAccountRoutes = require("./routes/manageAccountRoutes");
const arenaRoutes = require("./routes/arenaRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // ✅ ให้สามารถเข้าถึงไฟล์ใน `uploads/` ได้จาก URL

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
app.use("/api/upload", uploadRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/manage-account", manageAccountRoutes);
app.use("/api/arenas", arenaRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
