const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/SuperAdmin");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
          token = req.headers.authorization.split(" ")[1]; // ✅ ดึง Token ออกจาก Header
          console.log("📌 Token ที่ได้รับ:", token);

          const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ ตรวจสอบ JWT
          console.log("✅ Token Decode:", decoded);

          req.user = await User.findById(decoded.id).select("-password");

          if (!req.user) {
              return res.status(401).json({ message: "❌ ไม่พบผู้ใช้ หรือ Token ไม่ถูกต้อง" });
          }

          next();
      } catch (error) {
          console.error("❌ Token Verification Error:", error);
          return res.status(401).json({ message: "❌ Token ไม่ถูกต้อง" });
      }
  }

  if (!token) {
      console.error("🚨 ไม่มี Token ใน Header");
      return res.status(401).json({ message: "❌ ไม่ได้รับ Token" });
  }
};



// ✅ Middleware เช็คว่าเป็น SuperAdmin จริงๆ
exports.superAdminAuth = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง" });
  }
};


