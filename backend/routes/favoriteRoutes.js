const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

// 📌 ดึงรายการโปรดทั้งหมด
router.get("/", favoriteController.getFavorites);

// 📌 เพิ่มสนามเป็นรายการโปรด
router.post("/", favoriteController.addFavorite);  // <-- ตรวจสอบตรงนี้

// 📌 ลบสนามออกจากรายการโปรด
router.delete("/:id", favoriteController.removeFavorite);

module.exports = router;
