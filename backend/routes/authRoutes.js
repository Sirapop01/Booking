const express = require("express");
const router = express.Router();
const MemberController = require("../controllers/memberController");

router.post("/register", MemberController.register);
router.post("/login", MemberController.login);
router.get("/getinfo/:id", MemberController.getMB);
router.get("/logout", MemberController.logout);
router.put("/update/:id", MemberController.updateUser);

module.exports = router;
