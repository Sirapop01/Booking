const express = require("express");
const router = express.Router();
const Arena = require("../models/Arena");
const Payment = require("../models/Payment");

// ✅ ดึงสนามทั้งหมดของเจ้าของสนาม (ownerId)
router.get("/stadiums/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const stadiums = await Arena.find({ businessOwnerId: ownerId });

    if (!stadiums || stadiums.length === 0) {
      return res.status(404).json({ message: "ไม่พบสนามของเจ้าของคนนี้" });
    }

    res.status(200).json(stadiums);
  } catch (error) {
    console.error("❌ Error fetching stadiums:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสนาม" });
  }
});

// ✅ ดึง Payment (ledger) ของสนามนั้น
router.get("/ledger/:arenaId", async (req, res) => {
  try {
    const { arenaId } = req.params;

    const ledgerData = await Payment.find({
      arenaId: arenaId,
      status: "confirmed", // ให้ดึงเฉพาะที่ยืนยันแล้ว
    });

    if (!ledgerData || ledgerData.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล Payment" });
    }

    res.status(200).json(ledgerData);
  } catch (error) {
    console.error("❌ Error fetching ledger data:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล Payment" });
  }
});

module.exports = router;
