const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    filename: String,
    url: String, // URL ที่จะใช้แสดงผลรูปภาพ
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);
