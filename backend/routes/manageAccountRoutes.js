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

// 📌 **เส้นทางสำหรับ "ผู้ใช้ทั่วไป (Users)"**
router.get("/users", getUsers); // ✅ ดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/users/:id", getUserById); // ✅ ดึงข้อมูลผู้ใช้ตาม ID
router.delete("/users/:id", deleteUser); // ✅ ลบบัญชีผู้ใช้
router.put("/users/blacklist/:id", toggleBlacklistUser); // ✅ ตั้ง/ยกเลิก Blacklist ผู้ใช้

// 📌 **เส้นทางสำหรับ "เจ้าของสนาม (Owners)"**
router.get("/owners", getOwners); // ✅ ดึงข้อมูลเจ้าของสนามทั้งหมด
router.get("/owners/:id", getOwnerById); // ✅ ดึงข้อมูลเจ้าของสนามตาม ID
router.delete("/owners/:id", deleteOwner); // ✅ ลบบัญชีเจ้าของสนาม
router.put("/owners/blacklist/:id", toggleBlacklistOwner); // ✅ ตั้ง/ยกเลิก Blacklist เจ้าของสนาม

// 📌 **เส้นทางดึงข้อมูลสนามของเจ้าของ**
router.get("/owners/stadiums/:ownerId", getStadiumsByOwner); // ✅ ดึงรายการสนามของเจ้าของสนาม

module.exports = router;
