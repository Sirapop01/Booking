const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // ✅ ใช้ memoryStorage
const subStadiumController = require("../controllers/subStadiumController");

// ✅ ดึงข้อมูลสนามย่อยทั้งหมด
router.get("/:arenaId/:sportId", subStadiumController.getSubStadiums);

// ✅ เพิ่มสนามย่อยใหม่ (รองรับอัปโหลดหลายไฟล์)
router.post("/", upload.array("images", 5), subStadiumController.createSubStadium);

// ✅ อัปเดตข้อมูลสนามย่อย
router.put("/:id", upload.array("images", 5), subStadiumController.updateSubStadium);

// ✅ ลบสนามย่อย
router.delete("/:id", subStadiumController.deleteSubStadium);

module.exports = router;
