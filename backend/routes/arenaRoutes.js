const express = require("express");
const arenaController = require('../controllers/arenaController');
const upload = require('../middlewares/upload'); // เรียกใช้งานตัวใหม่
const router = express.Router();

router.post('/registerArena', upload.array('images', 5), arenaController.registerArena);
router.get("/getArenas", arenaController.getArenas);
router.get("/getArenaById/:id", arenaController.getArenaById);
router.put("/updateArena/:id", arenaController.updateArena);
router.delete("/deleteArena/:id", arenaController.deleteArena);
router.post("/toggleStatus", arenaController.toggleStadiumStatus);
router.get("/filteredArenas", arenaController.getFilteredArenas);
router.get("/arenasWithRatings", arenaController.getArenasWithRatings);

module.exports = router;
