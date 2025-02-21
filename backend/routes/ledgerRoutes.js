const express = require("express");
const router = express.Router();
const LedgerController = require("../controllers/ledgerController");

// ✅ ดึงสนามของเจ้าของสนาม
router.get("/arenas/owner/:ownerId", LedgerController.getStadiumsByOwner);

// ✅ ดึง payment (ledger) ของสนามนั้น
router.get("/arena/:arenaId", LedgerController.getLedgerByArena);

module.exports = router;
