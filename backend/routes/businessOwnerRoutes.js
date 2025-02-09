const express = require("express");
const router = express.Router();
const businessOwnerController = require("../controllers/businessOwnerController");

// Get all business owners
router.get("/", businessOwnerController.getAllBusinessOwners);

// Get business owner by ID
router.get("/:id", businessOwnerController.getBusinessOwnerById);

// Approve business owner
router.put("/:id/approve", businessOwnerController.approveBusinessOwner);

// Reject business owner
router.put("/:id/reject", businessOwnerController.rejectBusinessOwner);

// Delete business owner
router.delete("/:id", businessOwnerController.deleteBusinessOwner);

module.exports = router;
