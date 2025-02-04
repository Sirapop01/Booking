const User = require("../models/User"); // Import User Model
const BusinessOwner = require("../models/BusinessOwner"); // Import BusinessOwner Model
const bcrypt = require("bcryptjs");

exports.registerBusinessOwner = async (req, res) => {
    try {
        console.log("📩 Data received from Frontend:", req.body);

        const { email, password, firstName, lastName, phoneNumber, idCard, dob, role, acceptTerms } = req.body;

        // ✅ ค้นหาอีเมลจากทั้ง `users` และ `businessowners`
        const [existingUser, existingOwner] = await Promise.all([
            User.findOne({ email }), // ค้นหาใน Collection `users`
            BusinessOwner.findOne({ email }) // ค้นหาใน Collection `businessowners`
        ]);

        if (existingUser || existingOwner) {
            return res.status(400).json({
                success: false,
                message: "อีเมลนี้ถูกใช้ไปแล้วในระบบ!"
            });
        }

        // ✅ ค้นหา `idCard` ว่าซ้ำหรือไม่
        const existingIdCard = await BusinessOwner.findOne({ idCard });
        if (existingIdCard) {
            return res.status(400).json({
                success: false,
                message: "เลขบัตรประชาชนนี้ถูกใช้ไปแล้ว!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new BusinessOwner({
            email, password: hashedPassword, firstName, lastName, phoneNumber, idCard, dob, role, acceptTerms
        });

        console.log("✅ Creating new BusinessOwner:", newOwner);
        await newOwner.save();
        console.log("🎉 Data saved successfully!");

        res.status(201).json({
            success: true,
            message: "สมัครสมาชิกสำเร็จ! โปรดกรอกข้อมูลสนามและรอการอนุมัติ!"
        });

    } catch (error) {
        console.error("🚨 Error in register API:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
            error: error.message
        });
    }
};

// ✅ ค้นหา BusinessOwner ได้ทั้งจาก `id` หรือ `email`
exports.findBusinessOwner = async (req, res) => {
    try {
      const { id, email } = req.query;
  
      if (!id && !email) {
        return res.status(400).json({ message: "กรุณาใส่ ID หรือ Email" });
      }
  
      let query = {};
      if (id) query._id = id; // ✅ ค้นหาตาม `id`
      if (email) query.email = email; // ✅ ค้นหาตาม `email`
  
      const owner = await BusinessOwner.findOne(query);
  
      if (!owner) {
        return res.status(404).json({ message: "ไม่พบเจ้าของธุรกิจ" });
      }
  
      res.json({ 
        businessOwnerId: owner._id, 
        email: owner.email, 
        name: `${owner.firstName} ${owner.lastName}` 
      });
  
    } catch (error) {
      console.error("❌ Error fetching BusinessOwner:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
  };
