const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); 
const subStadiumController = require("../controllers/subStadiumController");
const bookingController = require("../controllers/bookingController"); // ✅ เพิ่ม Booking Controller

// ✅ ดึงเวลาที่ถูกจองของสนามย่อย (เปลี่ยนเส้นทางให้ชัดเจนขึ้น)
router.get("/substadiums/:id/reserved-slots", bookingController.getReservedSlots);

// ✅ ดึงข้อมูลสนามย่อยแต่ละสนาม
router.get("/details/:id", subStadiumController.getSubStadiumDetails);

// ✅ ดึงข้อมูลสนามย่อยทั้งหมด
router.get("/:arenaId/:sportId", subStadiumController.getSubStadiums);

// ✅ เพิ่มสนามย่อยใหม่
router.post("/", upload.array("images", 5), subStadiumController.createSubStadium);

// ✅ อัปเดตข้อมูลสนามย่อย
router.put("/:id", upload.array("images", 5), subStadiumController.updateSubStadium);

// ✅ ลบสนามย่อย
router.delete("/:id", subStadiumController.deleteSubStadium);

module.exports = router;
