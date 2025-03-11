const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/pending", paymentController.getPendingPayment);

module.exports = router;
