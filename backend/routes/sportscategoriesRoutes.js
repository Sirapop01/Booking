const express = require("express");
const router = express.Router();
const SportsCategory = require("../controllers/sportsCategoryController");

router.get("/sportscate", SportsCategory.getSportsByArena);  // ✅ ใช้ req.query (ไม่ต้องเปลี่ยน)
router.get("/searchBySport", SportsCategory.getArenasBySport);

module.exports = router;

