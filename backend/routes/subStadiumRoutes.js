const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); 
const subStadiumController = require("../controllers/subStadiumController");

// ✅ เพิ่มเส้นทางสำหรับดึงข้อมูลสนามย่อยแต่ละสนาม (วางไว้ก่อน `/:arenaId/:sportId`)
router.get("/details/:id", subStadiumController.getSubStadiumDetails);

// ✅ ดึงข้อมูลสนามย่อยทั้งหมด (ต้องวางไว้หลัง `/details/:id`)
router.get("/:arenaId/:sportId", subStadiumController.getSubStadiums);

// ✅ เพิ่มสนามย่อยใหม่ (รองรับอัปโหลดหลายไฟล์)
router.post("/", upload.array("images", 5), subStadiumController.createSubStadium);

// ✅ อัปเดตข้อมูลสนามย่อย
router.put("/:id", upload.array("images", 5), subStadiumController.updateSubStadium);

// ✅ ลบสนามย่อย
router.delete("/:id", subStadiumController.deleteSubStadium);

module.exports = router;
