const Payment = require("../models/Payment");
const Arena = require("../models/Arena");

// ✅ ดึงสนามทั้งหมดของเจ้าของสนาม
exports.getStadiumsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId || ownerId === "undefined") {
      return res.status(400).json({ message: "❌ Owner ID is missing or invalid" });
    }

    const stadiums = await Arena.find({ businessOwnerId: ownerId });

    if (!stadiums.length) {
      return res.status(404).json({ message: "❌ ไม่พบสนามของเจ้าของคนนี้" });
    }

    res.status(200).json(stadiums);
  } catch (error) {
    console.error("❌ Error fetching stadiums:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการดึงข้อมูลสนาม" });
  }
};

// ✅ ดึงข้อมูล payment ของสนาม (เฉพาะ confirmed)
exports.getLedgerByArena = async (req, res) => {
  try {
    const { arenaId } = req.params;

    if (!arenaId) {
      return res.status(400).json({ message: "❌ Arena ID is missing" });
    }

    const ledgerData = await Payment.find({
      arenaId: arenaId,
      status: "confirmed",
    });

    if (!ledgerData || ledgerData.length === 0) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูล Payment" });
    }

    res.status(200).json(ledgerData);
  } catch (error) {
    console.error("❌ Error fetching ledger data:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการดึงข้อมูล Payment" });
  }
};
