const express = require("express");
const router = express.Router();
const Stadium = require("../models/Stadium");

// ✅ ดึงข้อมูลสนามทั้งหมดของเจ้าของสนาม
router.get("/", async (req, res) => {
  try {
    const ownerId = req.query.owner_id; // รับ owner_id จาก query params
    if (!ownerId) return res.status(400).json({ error: "owner_id is required" });

    const stadiums = await Stadium.find({ owner_id: ownerId });
    res.json(stadiums);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการโหลดข้อมูลสนาม" });
  }
});

// ✅ เพิ่มสนามใหม่
router.post("/", async (req, res) => {
  try {
    const newStadium = new Stadium(req.body);
    const savedStadium = await newStadium.save();
    res.json(savedStadium);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มสนาม" });
  }
});

// ✅ อัปเดตข้อมูลสนาม
router.put("/:id", async (req, res) => {
  try {
    const updatedStadium = await Stadium.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStadium);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลสนาม" });
  }
});

// ✅ ลบสนามกีฬา
router.delete("/:id", async (req, res) => {
  try {
    await Stadium.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสนามสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบสนาม" });
  }
});

module.exports = router;
