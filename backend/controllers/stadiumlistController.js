const mongoose = require("mongoose");
const Arena = require("../models/Arena");

exports.getArenas = async (req, res) => {
    try {
        const { owner_id } = req.query;
        console.log("🆔 Received owner_id:", owner_id); // ✅ Debug owner_id ที่ได้รับ

        if (!owner_id) {
            return res.status(400).json({ message: "❌ owner_id is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner_id)) {
            return res.status(400).json({ message: "⚠️ owner_id ไม่ถูกต้อง" });
        }

        const objectId = new mongoose.Types.ObjectId(owner_id);
        console.log("🔍 MongoDB Querying with ObjectId:", objectId); // ✅ Debug ค่าที่ใช้ Query

        const arenas = await Arena.find({ businessOwnerId: objectId })
            .populate("businessOwnerId", "firstName lastName email phoneNumber")
            .lean(); // ✅ ใช้ lean() ให้ Query เร็วขึ้น

        console.log("📌 Fetched Arenas:", arenas); // ✅ Debug ข้อมูลสนามที่ดึงมา

        if (arenas.length === 0) {
            return res.status(404).json({ message: "⚠️ ไม่พบสนามที่คุณเป็นเจ้าของ" });
        }

        res.status(200).json(arenas);
    } catch (error) {
        console.error("❌ Error fetching arenas:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในระบบ", error: error.message });
    }
};
