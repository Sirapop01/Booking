const FavoriteArena = require("../models/favoriteModel");

// 📌 ดึงข้อมูล Favorite Arenas
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        console.log("🔍 Fetching favorites for userId:", userId);

        // ✅ ใช้ populate() เพื่อดึง fieldName, images, startTime, endTime, phone, additionalInfo (เอา distance ออก)
        const favorites = await FavoriteArena.find({ userId })
            .populate({
                path: "stadiumId",
                select: "fieldName images startTime endTime phone additionalInfo",
                options: { strictPopulate: false } // ✅ ป้องกัน Error ถ้า stadiumId ไม่มีข้อมูล
            })
            .lean();

        // ✅ ตรวจสอบค่าที่ดึงมา
        console.log("📌 Raw favorites from DB:", favorites);

        // ✅ ตรวจสอบว่ามีข้อมูลหรือไม่ก่อนส่ง response
        const updatedFavorites = favorites
            .filter(fav => fav.stadiumId) // ✅ กรองรายการที่ stadiumId เป็น null
            .map(fav => ({
                _id: fav._id,
                userId: fav.userId,
                stadiumId: fav.stadiumId._id,
                fieldName: fav.stadiumId.fieldName || "ไม่มีข้อมูล", // ✅ ดึงชื่อสนาม
                stadiumImage: fav.stadiumId.images?.[0] || "https://via.placeholder.com/150",
                phone: fav.stadiumId.phone || "ไม่มีข้อมูล", // ✅ ดึงเบอร์โทร
                startTime: fav.stadiumId.startTime || "ไม่ระบุ", // ✅ ดึงเวลาเปิดสนาม
                endTime: fav.stadiumId.endTime || "ไม่ระบุ", // ✅ ดึงเวลาปิดสนาม
                additionalInfo: fav.stadiumId.additionalInfo || "ไม่มีข้อมูลเพิ่มเติม", // ✅ ดึงข้อมูลเพิ่มเติม
                createdAt: fav.createdAt
            }));

        console.log("✅ Processed Favorites:", updatedFavorites);
        res.status(200).json(updatedFavorites);

    } catch (error) {
        console.error("❌ Error fetching favorites:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





// 📌 เพิ่มสนามเป็นรายการโปรด
exports.addFavorite = async (req, res) => {   
    try {
        console.log("📌 Data received in addFavorite:", req.body); // ✅ เช็คค่าใน backend
        
        const { userId, stadiumId } = req.body;
        if (!userId || !stadiumId) {
            return res.status(400).json({ error: "userId และ stadiumId จำเป็นต้องมี" });
        }

        const existingFavorite = await FavoriteArena.findOne({ userId, stadiumId });
        if (existingFavorite) {
            return res.status(400).json({ error: "สนามนี้อยู่ในรายการโปรดแล้ว" });
        }

        const newFavorite = new FavoriteArena({ userId, stadiumId });
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




// 📌 ลบรายการโปรดโดยใช้ userId และ stadiumId
exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId; // ✅ รองรับทั้ง query และ body
        const { stadiumId } = req.params;

        if (!userId || !stadiumId) {
            return res.status(400).json({ error: "userId และ stadiumId จำเป็นต้องมี" });
        }

        const deletedFavorite = await FavoriteArena.findOneAndDelete({ userId, stadiumId });

        if (!deletedFavorite) {
            return res.status(404).json({ error: "ไม่พบรายการโปรดที่ต้องการลบ" });
        }

        res.json({ message: "ลบรายการโปรดสำเร็จ!" });
    } catch (error) {
        console.error("❌ Error removing favorite:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// 📌 ตรวจสอบว่าสนามนี้อยู่ในรายการโปรดหรือไม่
exports.checkFavoriteStatus = async (req, res) => {
    try {
        const { userId } = req.query;
        const stadiumId = req.params.stadiumId;

        if (!userId || !stadiumId) {
            return res.status(400).json({ error: "userId และ stadiumId จำเป็นต้องมี" });
        }

        const favorite = await FavoriteArena.findOne({ userId, stadiumId });
        res.status(200).json({ isFavorite: !!favorite }); // ✅ ส่งค่า true หรือ false กลับไป
    } catch (error) {
        console.error("❌ Error checking favorite status:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



