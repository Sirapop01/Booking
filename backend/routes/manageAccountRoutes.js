const express = require("express");
const router = express.Router();
const {
  getUsers,
  getOwners,
  getUserById,
  getOwnerById,
  deleteUser,
  deleteOwner,
  toggleBlacklistUser,
  toggleBlacklistOwner,
  getStadiumsByOwner // ✅ เพิ่ม Controller ที่สร้างใหม่
} = require("../controllers/manageAccountController");

// 🔹 เส้นทางดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/users", getUsers);

// 🔹 เส้นทางดึงข้อมูลเจ้าของสนามทั้งหมด
router.get("/owners", getOwners);

// 🔹 เส้นทางดึงข้อมูลผู้ใช้ตาม ID
router.get("/users/:id", getUserById);

// 🔹 เส้นทางดึงข้อมูลเจ้าของสนามตาม ID
router.get("/owners/:id", getOwnerById);

// 🔹 เส้นทางลบผู้ใช้
router.delete("/users/:id", deleteUser);

// 🔹 เส้นทางลบเจ้าของสนาม
router.delete("/owners/:id", deleteOwner);

// 🔹 เส้นทางตั้ง/ยกเลิก Blacklist ผู้ใช้
router.put("/users/blacklist/:id", toggleBlacklistUser);

// 🔹 เส้นทางตั้ง/ยกเลิก Blacklist เจ้าของสนาม
router.put("/owners/blacklist/:id", toggleBlacklistOwner);

// ✅ เส้นทางดึงข้อมูลสนามของเจ้าของสนาม
router.get("/owners/stadiums/:ownerId", getStadiumsByOwner);

module.exports = router;
