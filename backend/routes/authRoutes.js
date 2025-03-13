const express = require("express");
const router = express.Router();
const MemberController = require("../controllers/memberController");
const upload = require('../middlewares/upload');

router.post('/register', upload.single('profileImage'), MemberController.register);
router.post("/login", MemberController.login);
router.get("/getinfo/:id", MemberController.getMB);
router.get("/logout", MemberController.logout);
router.put("/update/:id", upload.single("profileImage"), MemberController.updateUser);
router.post("/reset-password/:token", MemberController.resetPassword);
router.post("/forgot-password", MemberController.sendResetPasswordEmail);
router.delete("/delete/:id", MemberController.delete)

module.exports = router;
