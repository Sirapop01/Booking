const express = require("express");
const superAdmin = require("../controllers/superAdminController");

const router = express.Router();

router.post("/login",superAdmin.loginSuperAdmin); // ✅ เส้นทางเข้าสู่ระบบ

module.exports = router;
