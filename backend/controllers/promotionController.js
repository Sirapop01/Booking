const Promotion = require("../models/PromotionModel");
const Arena = require("../models/Arena"); // นำเข้า Model สนามกีฬา

// ✅ [POST] เพิ่มโปรโมชั่นใหม่
exports.createPromotion = async (req, res) => {
  try {
    const { ownerId, stadiumId, promotionTitle, description, discount, startDate, endDate, timeRange, imageUrl } = req.body;

    if (!ownerId || !stadiumId || !promotionTitle || !discount || !startDate || !endDate || !timeRange || !imageUrl) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (discount < 0) {
      return res.status(400).json({ error: "ส่วนลดต้องเป็นค่าบวกเท่านั้น" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ error: "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น" });
    }

    const stadiumExists = await Arena.findById(stadiumId);
    if (!stadiumExists) {
      return res.status(404).json({ error: "ไม่พบสนามกีฬาที่เลือก" });
    }

    const newPromotion = new Promotion({
      ownerId,
      stadiumId,
      promotionTitle,
      description,
      discount,
      startDate,
      endDate,
      timeRange,
      promotionImageUrl: imageUrl, // ✅ ใช้ URL ที่อัปโหลดไปยัง Cloudinary
    });

    await newPromotion.save();
    res.status(201).json({ message: "เพิ่มโปรโมชั่นสำเร็จ", promotion: newPromotion });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น" });
  }
};



// ✅ [GET] ดึงรายการโปรโมชั่นทั้งหมด
exports.getAllPromotions = async (req, res) => {
    try {
      const promotions = await Promotion.find().populate("stadiumId"); // ดึงข้อมูลสนามกีฬา
      res.status(200).json(promotions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงโปรโมชั่น" });
    }
  };
  

// ✅ [GET] ดึงโปรโมชั่นของสนามที่กำหนด
exports.getPromotionsByStadium = async (req, res) => {
    try {
      const { stadiumId } = req.params;
      const promotions = await Promotion.find({ stadiumId }).populate("stadiumId");
  
      if (!promotions.length) {
        return res.status(404).json({ message: "ไม่พบโปรโมชั่นสำหรับสนามนี้" });
      }
  
      res.status(200).json(promotions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงโปรโมชั่น" });
    }
  };
  

// ✅ [DELETE] ลบโปรโมชั่น
exports.deletePromotion = async (req, res) => {
    try {
      const { id } = req.params;
      const promotion = await Promotion.findById(id);
      if (!promotion) {
        return res.status(404).json({ error: "ไม่พบโปรโมชั่น" });
      }
  
      await Promotion.findByIdAndDelete(id);
      res.status(200).json({ message: "ลบโปรโมชั่นสำเร็จ" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบโปรโมชั่น" });
    }
  };
  
