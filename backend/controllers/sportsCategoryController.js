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
      const { sportName } = req.query; // รับชื่อกีฬา
      if (!sportName) {
          return res.status(400).json({ message: "กรุณาระบุประเภทกีฬา" });
      }

      console.log("📌 ค้นหาประเภทกีฬา:", sportName);

      // ✅ ค้นหา SportCategory ที่ตรงกับชื่อกีฬา
      const sportCategory = await SportsCategory.findOne({ sportName: { $regex: new RegExp(sportName, "i") } });

      if (!sportCategory || !sportCategory.arenaId) {
          return res.status(404).json({ message: "ไม่พบสนามกีฬาสำหรับประเภทนี้" });
      }

      console.log("📌 arenaId จาก sportsCategory:", sportCategory.arenaId);

      // ✅ ตรวจสอบว่า arenaId เป็น Array หรือ ค่าเดี่ยว
      let arenaIds = [];
      if (Array.isArray(sportCategory.arenaId)) {
          // ✅ ถ้าเป็น Array → ใช้ map() แปลงเป็น ObjectId อย่างถูกต้อง
          arenaIds = sportCategory.arenaId.map(id => new mongoose.Types.ObjectId(id));
      } else {
          // ✅ ถ้าเป็นค่าเดี่ยว → แปลงให้เป็น Array
          arenaIds = [new mongoose.Types.ObjectId(sportCategory.arenaId)];
      }

      console.log("📌 arenaIds ที่ใช้ค้นหา:", arenaIds);

      // ✅ ค้นหาสนามกีฬาที่ตรงกับ arenaIds
      const arenas = await Arena.find({ _id: { $in: arenaIds } });

      res.json(arenas);
  } catch (error) {
      console.error("❌ Error fetching arenas by sport:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสนามกีฬา" });
  }
};
