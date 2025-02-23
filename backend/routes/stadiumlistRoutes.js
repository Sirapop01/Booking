const express = require("express");
const router = express.Router();
const stadiumController = require("../controllers/stadiumlistController");

// ✅ แก้ไขเส้นทางให้ถูกต้อง
router.get("/getArenas", stadiumController.getArenas);

module.exports = router;
