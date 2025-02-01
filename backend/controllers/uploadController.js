const Image = require("../models/Image");
const path = require("path");

// อัปโหลดไฟล์และบันทึกลง MongoDB
const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    try {
        const newImage = new Image({
            filename: req.file.filename,
            url: imageUrl
        });

        await newImage.save();
        res.status(201).json({ message: "Upload successful", imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ดึงรูปภาพทั้งหมด
const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadImage, getImages };
