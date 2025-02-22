const express = require("express");
const adminController = require("../controllers/adminController"); // ✅ Import เป็น Object
const router = express.Router();

router.post("/register", adminController.registerAdmin); // ✅ ใช้ adminController.registerAdmin
router.post("/login", adminController.loginAdmin);

module.exports = router;
