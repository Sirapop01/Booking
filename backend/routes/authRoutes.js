const express = require("express");
const router = express.Router();
const MemberController = require("../controllers/memberController");

// เส้นทางสมัครสมาชิก
router.post("/register", MemberController.register);
router.post("/login", MemberController.login);
router.get("/getinfo/:id", MemberController.getMB);
router.get("/logout", MemberController.logout);

module.exports = router;
