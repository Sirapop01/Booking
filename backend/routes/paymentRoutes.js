const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/upload")

router.post("/submit", upload.single("slipImage"), paymentController.submitPayment);
router.get("/pending", paymentController.getPendingPayment);
router.put("/cancel-booking", paymentController.cancelBooking);

module.exports = router;
