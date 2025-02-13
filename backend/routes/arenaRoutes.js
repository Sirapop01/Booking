const express = require("express");
const { registerArena, getArenas, getArenaById, updateArena, deleteArena } = require("../controllers/arenaController");
const { upload } = require("../controllers/uploadController");

const router = express.Router();

// ✅ API เพิ่มสนามกีฬา (รับ URL ของรูปภาพ)
router.post("/register", registerArena);

// ✅ API ดึงข้อมูลสนามกีฬา
router.get("/", getArenas);

// ✅ API ดึงข้อมูลสนามเฉพาะ ID
router.get("/:id", getArenaById);

// ✅ API อัปเดตข้อมูลสนามกีฬา
router.put("/:id", updateArena);

// ✅ API ลบสนามกีฬา
router.delete("/:id", deleteArena);

module.exports = router;
