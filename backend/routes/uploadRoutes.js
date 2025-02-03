const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

router.post("/uploadProfile", uploadController.upload.single("profileImage"), uploadController.uploadProfileImage);

module.exports = router;
