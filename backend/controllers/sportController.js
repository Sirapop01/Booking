const Sport = require("../models/sportModel");

// 📌 ดึงประเภทกีฬาทั้งหมด
exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 ดึงประเภทกีฬาของสนามกีฬา (ตาม arenaId)
exports.getSportsByArena = async (req, res) => {
  try {
    const { arenaId } = req.params;
    const sports = await Sport.find({ arenaId });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 เพิ่มประเภทกีฬาใหม่
exports.addSport = async (req, res) => {
  try {
    const { arenaId, sportName, iconUrl, description } = req.body;
    const newSport = new Sport({ arenaId, sportName, iconUrl, description });
    await newSport.save();
    res.status(201).json(newSport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 ลบประเภทกีฬา
exports.deleteSport = async (req, res) => {
  try {
    const { id } = req.params;
    await Sport.findByIdAndDelete(id);
    res.json({ message: "ลบประเภทกีฬาเรียบร้อย" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
