const Arena = require("../models/Arena");
const BusinessOwner = require("../models/BusinessOwner");


// ✅ ฟังก์ชัน Register สนามกีฬา (รับ URL ของรูปภาพ)
exports.registerArena = async (req, res) => {
    try {
      console.log("📩 Register Arena Request Body:", req.body);  // ✅ Debugging
  
      const { fieldName, ownerName, phone, startTime, endTime, location, amenities, additionalInfo, businessOwnerId, images } = req.body;
  
      if (!fieldName || !ownerName || !phone || !startTime || !endTime || !location || !images || images.length === 0) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
  
      // ✅ ตรวจสอบว่า BusinessOwner มีอยู่จริง
      const businessOwner = await BusinessOwner.findById(businessOwnerId);
      if (!businessOwner) {
        return res.status(404).json({ message: "ไม่พบข้อมูลเจ้าของธุรกิจ" });
      }
  
      // ✅ บันทึกข้อมูลสนาม
      const newArena = await Arena.create({
        fieldName,
        ownerName,
        phone,
        startTime, 
        endTime,
        location,
        amenities: amenities || [], // ป้องกันค่าว่าง
        additionalInfo: additionalInfo || "",
        images, // ✅ รองรับ Array ของรูปภาพ
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

// ✅ ดึงข้อมูลสนามกีฬาโดยใช้ ID (JOIN BusinessOwner)
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
