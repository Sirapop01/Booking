const mongoose = require("mongoose");

const FavoriteArenaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true }, // ✅ ใช้แค่ stadiumId
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("favoritearenas", FavoriteArenaSchema);

