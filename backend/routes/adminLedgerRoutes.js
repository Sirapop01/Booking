const express = require("express");
const router = express.Router();
const adminLedgerController = require("../controllers/adminLedgerController");

// ✅ Route สำหรับดึงสนามทั้งหมดของเจ้าของ
router.get("/stadiums/:ownerId", adminLedgerController.getStadiumsByOwner);

// ✅ Route สำหรับดึง Payment (Ledger) ของสนาม
router.get("/ledger/:arenaId", adminLedgerController.getLedgerByArena);

module.exports = router;
