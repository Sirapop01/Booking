
// ✅ ฟังก์ชัน Register สนามกีฬา (รับ URL ของรูปภาพ)
const Arena = require("../models/Arena");
const BusinessOwner = require("../models/BusinessOwner");

exports.registerArena = async (req, res) => {
  try {
    console.log("📩 Register Arena Request Body:", req.body);
    console.log("📤 Uploaded Files:", req.files);

    const { fieldName, ownerName, phone, startTime, endTime, location, additionalInfo, businessOwnerId } = req.body;
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

    if (!fieldName || !ownerName || !phone || !startTime || !endTime || !location || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน และอัปโหลดภาพอย่างน้อย 1 รูป" });
    }

    // ตรวจสอบว่าเจ้าของธุรกิจมีอยู่จริง
    const businessOwner = await BusinessOwner.findById(businessOwnerId);
    if (!businessOwner) {
      return res.status(404).json({ message: "ไม่พบข้อมูลเจ้าของธุรกิจ" });
    }

    // ดึง URL จาก Cloudinary ที่ multer อัปโหลดไปแล้ว
    const images = req.files.map(file => file.path);

    const newArena = await Arena.create({
      fieldName,
      ownerName,
      phone,
      startTime,
      endTime,
      location: JSON.parse(location), // ถ้า location ส่งมาเป็น JSON string ต้องแปลงก่อน
      amenities, // ✅ ใช้ amenities ตรง ๆ ได้เลย เพราะเป็น Array อยู่แล้ว
      additionalInfo,
      images,
      businessOwnerId
    });

    console.log("✅ Arena Registered Successfully:", newArena);
    res.status(201).json({ message: "สมัครสมาชิกสนามสำเร็จ!", arena: newArena });

  } catch (err) {
    console.error("❌ Error registering arena:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error: err.message });
  }
};

  

// ✅ ดึงข้อมูลสนามกีฬาทั้งหมด (JOIN BusinessOwner)
exports.getArenas = async (req, res) => {
  try {
    const arenas = await Arena.find().populate("businessOwnerId", "firstName lastName email phoneNumber");
    res.status(200).json(arenas);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

// ✅ ดึงข้อมูลสนามกีฬาโดยใช้ ID (JOIN BusinessOwner) fix
exports.getArenaById = async (req, res) => {
  try {
    const arena = await Arena.findById(req.params.id).populate("businessOwnerId", "firstName lastName email phoneNumber");
    if (!arena) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสนาม" });
    }
    res.status(200).json(arena);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

// ✅ อัปเดตข้อมูลสนามกีฬา
exports.updateArena = async (req, res) => {
  try {    
    const updatedArena = await Arena.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("businessOwnerId");
    if (!updatedArena) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสนาม" });
    }
    res.status(200).json({ message: "อัปเดตสำเร็จ", arena: updatedArena });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

// ✅ ลบสนามกีฬา
exports.deleteArena = async (req, res) => {
  try {
    const deletedArena = await Arena.findByIdAndDelete(req.params.id);
    if (!deletedArena) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสนาม" });
    }
    res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};
