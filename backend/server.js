const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes"); // ✅ เพิ่ม Stadium Routes

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection String (Replace with your credentials)
const MONGO_URI = "mongodb+srv://Booking:Booking@cluster0.1cryq.mongodb.net/BookingDB"; // ✅ ต้องกำหนด Database Name

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop server if MongoDB fails
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stadiums", stadiumRoutes); // ✅ เพิ่ม API ของสนามกีฬา

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
