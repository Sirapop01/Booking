const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/upload")

router.post("/submit", upload.single("slipImage"), paymentController.submitPayment);
router.get("/pending", paymentController.getPendingPayment);
router.put("/cancel-booking", paymentController.cancelBooking);

router.get("/paid-users", paymentController.getPaidUsers);
router.get("/user-bookings", paymentController.getUserBookings);

router.put("/confirm/:id", paymentController.confirmBooking);
router.put("/reject/:id", paymentController.rejectBooking);

module.exports = router;
