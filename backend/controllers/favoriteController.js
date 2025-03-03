const FavoriteArena = require("../models/favoriteModel");

// 📌 ดึงข้อมูล Favorite Arenas
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        console.log("🔍 Fetching favorites for userId:", userId);

        // ✅ ใช้ populate() เพื่อดึง fieldName จาก stadiumId
        const favorites = await FavoriteArena.find({ userId })
            .populate({
                path: "stadiumId",
                select: "fieldName images"
            })
            .lean();

        // ✅ ดึงเฉพาะ fieldName และรูปภาพแรก
        const updatedFavorites = favorites.map(fav => ({
            _id: fav._id,
            userId: fav.userId,
            stadiumId: fav.stadiumId._id,
            fieldName: fav.stadiumId.fieldName, // ✅ ดึงชื่อสนามจาก stadiumId
            stadiumImage: fav.stadiumId.images?.length > 0 ? fav.stadiumId.images[0] : null,
            createdAt: fav.createdAt
        }));

        console.log("✅ Found Favorites:", updatedFavorites);
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



