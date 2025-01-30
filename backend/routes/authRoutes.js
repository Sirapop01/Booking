const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // ✅ เพิ่มบรรทัดนี้
const MemberController = require("../controllers/memberController");

// ตั้งค่า multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
router.put("/updateProfileImage/:id", upload.single("profileImage"), MemberController.updateProfileImage);
router.post("/register", upload.single("profileImage"), (req, res, next) => {
    console.log("📂 File received:", req.file); // ✅ Debugging log
    next();
}, MemberController.register);



router.post("/login", MemberController.login);
router.get("/getinfo/:id", MemberController.getMB);
router.get("/logout", MemberController.logout);
router.put("/update/:id", MemberController.updateUser);

module.exports = router;
