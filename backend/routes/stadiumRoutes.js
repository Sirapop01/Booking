// routes/stadiumRoutes.js
const express = require("express");
const router = express.Router();
const stadiumController = require("../controllers/stadiumController");

router.get("/", stadiumController.getStadiumsByOwner);
router.post("/", stadiumController.createStadium);
router.put("/:id", stadiumController.updateStadium);
router.delete("/:id", stadiumController.deleteStadium);

module.exports = router;
