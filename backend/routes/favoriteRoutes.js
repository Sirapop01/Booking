const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

// 📌 ดึงรายการโปรดทั้งหมด
router.get("/", favoriteController.getFavorites);

// 📌 เพิ่มสนามเป็นรายการโปรด
router.post("/", favoriteController.addFavorite);  

// 📌 ลบสนามออกจากรายการโปรด
router.delete("/:stadiumId", favoriteController.removeFavorite);

// ✅ เส้นทางสำหรับเช็คสถานะ
router.get("/check/:stadiumId", favoriteController.checkFavoriteStatus);


module.exports = router;
