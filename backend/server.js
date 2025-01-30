const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // ทำให้โฟลเดอร์ uploads เป็น static

const MONGO_URI = "mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/images", uploadRoutes); // เพิ่ม Route สำหรับการอัปโหลดรูป

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
