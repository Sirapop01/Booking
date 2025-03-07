const express = require("express");
const arenaController = require('../controllers/arenaController');
const upload = require('../middlewares/upload'); // เรียกใช้งานตัวใหม่
const router = express.Router();

router.post('/registerArena', upload.array('images', 5), arenaController.registerArena);


// ✅ API ดึงข้อมูลสนามกีฬา fix
router.get("/getArenas", arenaController.getArenas);

// ✅ API ดึงข้อมูลสนามเฉพาะ ID
router.get("/getArenaById/:id", arenaController.getArenaById);

// ✅ API อัปเดตข้อมูลสนามกีฬา
router.put("/updateArena/:id", arenaController.updateArena);

// ✅ API ลบสนามกีฬา
router.delete("/deleteArena/:id", arenaController.deleteArena);

router.post("/toggleStatus", arenaController.toggleStadiumStatus);
router.get("/searchArenas", arenaController.searchArenas);
router.get("/getArenasBySport/:sportName", arenaController.getArenasBySport);

module.exports = router;
