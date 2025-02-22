const express = require("express");
const router = express.Router();
const stadiumController = require("../controllers/stadiumlistController");

// 📌 เส้นทางสำหรับดึงข้อมูลสนามกีฬาตาม owner_id
router.get("/getArenas", stadiumController.getArenas);

module.exports = router;
