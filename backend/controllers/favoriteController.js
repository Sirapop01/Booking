const FavoriteArena = require("../models/favoriteModel");

// 📌 ดึงข้อมูล Favorite Arenas
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        console.log("🔍 Fetching favorites for userId:", userId);

        // ✅ Populate stadiumId และดึงเฉพาะ fieldName + รูปที่ index [0]
        const favorites = await FavoriteArena.find({ userId })
            .populate({
                path: "stadiumId",
                select: "fieldName images"
            })
            .lean();

        // ✅ ดึงรูปแรกจาก images array เท่านั้น
        const updatedFavorites = favorites.map(fav => ({
            ...fav,
            stadiumImage: fav.stadiumId.images?.length > 0 ? fav.stadiumId.images[0] : null
        }));

        console.log("✅ Found Favorites:", updatedFavorites);
        res.status(200).json(updatedFavorites);
    } catch (error) {
        console.error("❌ Error fetching favorites:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





// 📌 เพิ่มสนามเป็นรายการโปรด
exports.addFavorite = async (req, res) => {   // <-- ตรวจสอบว่ามีการ export ฟังก์ชันนี้หรือไม่
    try {
        const { userId, stadiumId, fieldName } = req.body;
        const newFavorite = new FavoriteArena({ userId, stadiumId, fieldName });
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 📌 ลบรายการโปรด
exports.removeFavorite = async (req, res) => {
    try {
        await FavoriteArena.findByIdAndDelete(req.params.id);
        res.json({ message: "Favorite removed!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
