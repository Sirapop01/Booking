const express = require("express");
const router = express.Router();
const manageOwnerController = require("../controllers/manageOwnerController");

// 📌 ดึงรายชื่อเจ้าของสนามทั้งหมด
router.get("/", manageOwnerController.getAllOwners);

// 📌 ลบบัญชีเจ้าของสนาม
router.delete("/:id", manageOwnerController.deleteOwner);

// 📌 เปลี่ยนสถานะบัญชี (Blacklist / Unblacklist)
router.put("/blacklist/:id", manageOwnerController.toggleBlacklistOwner);

module.exports = router;
