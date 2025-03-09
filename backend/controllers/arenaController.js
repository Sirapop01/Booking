const mongoose = require("mongoose");
const Arena = require("../models/Arena");
const User = require("../models/User")
const SportsCategory = require("../models/SportsCategory")
const BusinessOwner = require("../models/BusinessOwner");
const jwt = require("jsonwebtoken");
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

// ✅ ฟังก์ชันคำนวณระยะทาง (Haversine formula)
const getDistance = (userLocation, arenaLocation) => {
  if (!userLocation || !arenaLocation) return Infinity;

  const [lon1, lat1] = userLocation;
  const [lon2, lat2] = arenaLocation;
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // รัศมีโลก (กิโลเมตร)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // ระยะทางเป็นกิโลเมตร
};

exports.getFilteredArenas = async (req, res) => {
  try {
    const { query, sport, status, startTime, endTime } = req.query;
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่พบ Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("location");
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const userLocation = user.location?.coordinates; // [longitude, latitude]

    let filter = {};

    if (query) filter.fieldName = { $regex: query, $options: "i" };
    if (sport) {
      const sportCategories = await SportsCategory.find({ sportName: { $in: sport.split(",") } });
      const arenaIds = sportCategories.map(sport => sport.arenaId);
      filter._id = { $in: arenaIds };
    }
    if (status === "เปิด") filter.open = true;

    // ✅ ตรวจสอบช่วงเวลา
    if (startTime && endTime) {
      filter.$and = [
        { startTime: { $lte: startTime } },
        { endTime: { $gte: endTime } }
      ];
    }

    const arenas = await Arena.find(filter).lean();
    const arenasWithDistance = arenas.map(arena => {
      const arenaLocation = arena.location?.coordinates;
      const distance = getDistance(userLocation, arenaLocation);
      return { ...arena, distance };
    });

    arenasWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(arenasWithDistance);
  } catch (error) {
    console.error("❌ Error filtering arenas:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};





