const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes"); // ✅ เพิ่ม Stadium Routes
const uploadRoutes = require("./routes/uploadRoutes");
const businessRoutes = require("./routes/businessRoutes");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // ทำให้โฟลเดอร์ uploads เป็น static

// MongoDB Connection String (Replace with your credentials)
const MONGO_URI = "mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/BookingDB"; // ✅ ต้องกำหนด Database Name

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });


app.use("/uploads", express.static("uploads")); // ให้เข้าถึงรูปภาพผ่าน URL ได้
app.use("/api/auth", authRoutes);
app.use("/api/stadiums", stadiumRoutes); // ✅ เพิ่ม API ของสนามกีฬา
app.use("/api/images", uploadRoutes); // เพิ่ม Route สำหรับการอัปโหลดรูป
app.use("/api/business", businessRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
