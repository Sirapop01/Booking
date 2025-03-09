const SportsCategory = require("../models/SportsCategory");
const Arena = require("../models/Arena");
const mongoose = require("mongoose");


// 📌 ✅ ดึงประเภทกีฬาทั้งหมดของสนามที่เลือก
exports.getSportsByArena = async (req, res) => {
    try {
      const { arenaId } = req.query;  // ✅ เปลี่ยนจาก req.params เป็น req.query
      console.log(`📌 กำลังดึงประเภทกีฬาสำหรับสนาม ID: ${arenaId}`);
  
      if (!arenaId) {
        return res.status(400).json({ message: "กรุณาระบุ arenaId" });
      }
  
      const sports = await SportsCategory.find({ arenaId: arenaId });
  
      if (!sports.length) {
        return res.status(404).json({ message: "ไม่พบข้อมูลประเภทกีฬา" });
      }
  
      res.json(sports);
    } catch (error) {
      console.error("⚠️ เกิดข้อผิดพลาดในการดึงข้อมูลประเภทกีฬา:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  };
  

// 📌 ✅ เพิ่มประเภทกีฬาใหม่
exports.addSportsCategory = async (req, res) => {
  try {
    const { arenaId, sportName, iconUrl, description } = req.body;

    if (!arenaId || !sportName) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newSport = new SportsCategory({ arenaId, sportName, iconUrl, description });
    await newSport.save();

    res.status(201).json({ message: "เพิ่มประเภทกีฬาสำเร็จ", sport: newSport });
  } catch (error) {
    console.error("⚠️ เกิดข้อผิดพลาดในการเพิ่มประเภทกีฬา:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// 📌 ✅ ลบประเภทกีฬา
exports.deleteSportsCategory = async (req, res) => {
  try {
    const { sportId } = req.params;

    const deletedSport = await SportsCategory.findByIdAndDelete(sportId);

    if (!deletedSport) {
      return res.status(404).json({ message: "ไม่พบประเภทกีฬาที่ต้องการลบ" });
    }

    res.json({ message: "ลบประเภทกีฬาสำเร็จ" });
  } catch (error) {
    console.error("⚠️ เกิดข้อผิดพลาดในการลบประเภทกีฬา:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.getArenasBySport = async (req, res) => {
  try {
      const { sportName } = req.query;

      if (!sportName) {
          return res.status(400).json({ message: "กรุณาระบุประเภทกีฬา" });
      }

      const sportCategory = await SportsCategory.findOne({ sportName });

      if (!sportCategory || !sportCategory.arenaId) {
          return res.status(404).json({ message: "ไม่พบสนามที่มีประเภทกีฬา" });
      }

      // ✅ ค้นหาสนามจาก arenaId
      const arenas = await Arena.find({ _id: { $in: sportCategory.arenaId } });

      res.json(arenas);
  } catch (error) {
      console.error("❌ Error fetching arenas by sport:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};



