const express = require("express");
const router = express.Router();
const upload = require("../config/multerCloudinaryConfig");
const arenaManageController = require("../controllers/arenaManageController"); // ✅ ตรวจสอบการ import

// ✅ ตรวจสอบว่าฟังก์ชันมีอยู่จริงก่อนใช้งาน
if (!arenaManageController.registerArena || !arenaManageController.getArenaById || !arenaManageController.updateArena) {
  console.error("❌ Error: arenaManageController is missing required functions");
}

// ✅ ใช้ `upload.array("images", 4)` จาก Cloudinary
router.post("/registerArena", upload.array("images", 4), arenaManageController.registerArena);
router.get("/getArenaById/:arenaId", arenaManageController.getArenaById);
router.put("/updateArena/:arenaId", upload.array("images", 4), arenaManageController.updateArena);


module.exports = router;
