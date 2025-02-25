const express = require("express");
const router = express.Router();
const sportController = require("../controllers/sportController");

// 📌 ดึงประเภทกีฬาทั้งหมด
router.get("/", sportController.getAllSports);

// 📌 ดึงประเภทกีฬาตามสนามกีฬา (arenaId)
router.get("/:arenaId", sportController.getSportsByArena);

// 📌 เพิ่มประเภทกีฬาใหม่
router.post("/", sportController.addSport);

// 📌 ลบประเภทกีฬา
router.delete("/:id", sportController.deleteSport);

module.exports = router;
