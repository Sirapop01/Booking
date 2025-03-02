const mongoose = require("mongoose");
const FavoriteArenaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true },
    fieldName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// ตรวจสอบให้แน่ใจว่าชื่อนี้ตรงกับ database
module.exports = mongoose.model("favoritearenas", FavoriteArenaSchema);
