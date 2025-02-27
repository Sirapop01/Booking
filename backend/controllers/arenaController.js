const mongoose = require("mongoose");
const Arena = require("../models/Arena");
const BusinessOwner = require("../models/BusinessOwner");

// ✅ ฟังก์ชัน Register สนามกีฬา (รับ URL ของรูปภาพ)
exports.registerArena = async (req, res) => {
  try {
    console.log("📩 Register Arena Request Body:", req.body);
    console.log("📤 Uploaded Files:", req.files);

    const { fieldName, ownerName, phone, startTime, endTime, location, additionalInfo, businessOwnerId } = req.body;
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

    if (!fieldName || !ownerName || !phone || !startTime || !endTime || !location || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน และอัปโหลดภาพอย่างน้อย 1 รูป" });
    }

    // ✅ ตรวจสอบว่า businessOwnerId เป็น ObjectId ที่ถูกต้อง
    if (!mongoose.Types.ObjectId.isValid(businessOwnerId)) {
      return res.status(400).json({ message: "⚠️ businessOwnerId ไม่ถูกต้อง" });
    }

    const businessOwner = await BusinessOwner.findById(businessOwnerId);
    if (!businessOwner) {
      return res.status(404).json({ message: "⚠️ ไม่พบข้อมูลเจ้าของธุรกิจ" });
    }

    // ✅ ตรวจสอบค่าของ `location` และแปลง JSON String เป็น Object
    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
      if (!parsedLocation.coordinates || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
        return res.status(400).json({ message: "⚠️ พิกัดสถานที่ไม่ถูกต้อง" });
      }
    } catch (err) {
      return res.status(400).json({ message: "⚠️ รูปแบบพิกัดสถานที่ผิดพลาด" });
    }

    // ✅ เพิ่มค่า `open` และ `status`
    const images = req.files.map(file => file.path);

    const newArena = await Arena.create({
      fieldName,
      ownerName,
      phone,
      startTime,
      endTime,
      location: parsedLocation,
      amenities,
      additionalInfo,
      images,
      businessOwnerId,
      open: true,  // ✅ ค่าเริ่มต้นของสนามคือเปิดใช้งาน
      status: "พร้อมใช้งาน",  // ✅ สถานะเริ่มต้น
    });

    console.log("✅ Arena Registered Successfully:", newArena);
    res.status(201).json({ message: "✅ สมัครสมาชิกสนามสำเร็จ!", arena: newArena });

  } catch (err) {
    console.error("❌ Error registering arena:", err);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในระบบ", error: err.message });
  }
};

// ✅ ดึงข้อมูลสนามกีฬาตาม `owner_id`
exports.getArenas = async (req, res) => {
  try {
      const { owner_id } = req.query;
      console.log("📢 Owner ID ที่รับมา:", owner_id); // ✅ Debugging

      const arenas = await Arena.find({ owner_id });
      console.log("✅ สนามที่โหลดจาก DB:", arenas); // ✅ Debugging

      res.json(arenas);
  } catch (error) {
      console.error("❌ Error loading arenas:", error);
      res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการโหลดสนาม" });
  }
};


// ✅ ดึงข้อมูลสนามกีฬาโดยใช้ `arena_id`
exports.getArenaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ arena_id ไม่ถูกต้อง" });
    }

    const arena = await Arena.findById(id).populate("businessOwnerId", "firstName lastName email phoneNumber");

    if (!arena) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนาม" });
    }

    res.status(200).json(arena);
  } catch (error) {
    console.error("❌ Error fetching arena by ID:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในระบบ", error: error.message });
  }
};

// ✅ อัปเดตข้อมูลสนามกีฬา
exports.updateArena = async (req, res) => {
  try {    
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ arena_id ไม่ถูกต้อง" });
    }

    const updatedArena = await Arena.findByIdAndUpdate(id, req.body, { new: true }).populate("businessOwnerId");

    if (!updatedArena) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนาม" });
    }

    res.status(200).json({ message: "✅ อัปเดตข้อมูลสนามสำเร็จ!", arena: updatedArena });
  } catch (error) {
    console.error("❌ Error updating arena:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในระบบ", error: error.message });
  }
};

// ✅ ลบสนามกีฬา
exports.deleteArena = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ arena_id ไม่ถูกต้อง" });
    }

    const deletedArena = await Arena.findByIdAndDelete(id);

    if (!deletedArena) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนาม" });
    }

    res.status(200).json({ message: "✅ ลบข้อมูลสนามสำเร็จ!" });
  } catch (error) {
    console.error("❌ Error deleting arena:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในระบบ", error: error.message });
  }
};

exports.toggleStadiumStatus = async (req, res) => {
  try {
      const { arenaId, open } = req.body;
      console.log("📢 รับค่า:", { arenaId, open }); // ✅ Debugging

      if (!mongoose.Types.ObjectId.isValid(arenaId)) {
          return res.status(400).json({ message: "⚠️ arenaId ไม่ถูกต้อง" });
      }

      // ✅ ตรวจสอบว่ามีสนามก่อนอัปเดต
      const existingArena = await Arena.findById(arenaId);
      if (!existingArena) {
          return res.status(404).json({ message: "❌ ไม่พบข้อมูลสนามก่อนอัปเดต" });
      }

      // ✅ อัปเดตสถานะ
      const updatedArena = await Arena.findByIdAndUpdate(
          arenaId,
          { open: open },
          { new: true }
      );

      if (!updatedArena) {
          return res.status(404).json({ message: "❌ สนามหายไปหลังอัปเดต" });
      }

      console.log("✅ อัปเดตสถานะสนามสำเร็จ:", updatedArena); // ✅ Debugging
      res.status(200).json({ message: "✅ อัปเดตสถานะสนามสำเร็จ!", arena: updatedArena });

  } catch (error) {
      console.error("❌ Error updating stadium status:", error);
      res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการอัปเดตสถานะสนาม", error: error.message });
  }
};

