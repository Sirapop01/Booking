const Arena = require("../models/Arena");
const upload = require("../config/multerCloudinaryConfig");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // ✅ ต้อง require ก่อนใช้งาน
const fs = require("fs");

// ✅ ฟังก์ชันสร้างสนามใหม่
const registerArena = async (req, res) => {
    try {
        const newArena = new Arena({
            fieldName: req.body.fieldName,
            ownerName: req.body.ownerName,
            phone: req.body.phone,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            location: JSON.parse(req.body.location),
            businessOwnerId: req.body.businessOwnerId,
            additionalInfo: req.body.additionalInfo,
            amenities: JSON.parse(req.body.amenities),
            images: req.files ? req.files.map(file => file.path) : [],
        });

        const savedArena = await newArena.save();
        res.status(201).json(savedArena);
    } catch (error) {
        console.error("❌ Error registering arena:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error });
    }
};

// ✅ ฟังก์ชันดึงข้อมูลสนามตาม ID
const getArenaById = async (req, res) => {
    try {
        const arena = await Arena.findById(req.params.arenaId);
        if (!arena) return res.status(404).json({ message: "Arena not found" });
        res.status(200).json(arena);
    } catch (error) {
        console.error("❌ Error fetching arena:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error });
    }
};

// ✅ ฟังก์ชันอัปเดตข้อมูลสนาม
const updateArena = async (req, res) => {
    try {
        const { arenaId } = req.params;
        const { fieldName, ownerName, phone, startTime, endTime, location, additionalInfo, amenities } = req.body;

        if (!arenaId) {
            return res.status(400).json({ message: "Arena ID is required" });
        }

        console.log("🛠 Updating Arena:", arenaId);

        // ✅ ค้นหา Arena เดิม
        const existingArena = await Arena.findById(arenaId);
        if (!existingArena) {
            return res.status(404).json({ message: "Arena not found" });
        }

        let newImages = existingArena.images; // เริ่มต้นด้วยรูปภาพเดิม

        if (req.files && req.files.length > 0) {
            console.log("🗑️ Deleting old images from Cloudinary...");

            // ✅ ลบรูปเดิมจาก Cloudinary ถ้ามี
            for (const oldImage of existingArena.images) {
                try {
                    if (oldImage.startsWith("http")) { // ✅ ตรวจสอบว่ารูปเป็น URL ของ Cloudinary
                        const publicId = oldImage.split("/").pop().split(".")[0]; // ดึง `public_id` ของรูปเดิม
                        await cloudinary.uploader.destroy(`stadium-images/${publicId}`);
                        console.log("🗑️ Deleted old image:", publicId);
                    }
                } catch (err) {
                    console.error("❌ Error deleting image from Cloudinary:", err);
                }
            }

            // ✅ อัปโหลดรูปใหม่ไปยัง Cloudinary
            console.log("📤 Uploading new images to Cloudinary...");
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { folder: "stadium-images" });

                // ✅ ลบไฟล์จากเซิร์ฟเวอร์เฉพาะไฟล์ที่อัปโหลดจากเครื่อง
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }

                return result.secure_url;
            });

            newImages = await Promise.all(uploadPromises);
        }

        // ✅ ตรวจสอบ `location` ว่ามีค่าก่อน parse
        let parsedLocation;
        try {
            parsedLocation = location ? JSON.parse(location) : existingArena.location;
        } catch (err) {
            return res.status(400).json({ message: "Invalid location format" });
        }

        // ✅ อัปเดตข้อมูลใน MongoDB
        const updatedArena = await Arena.findByIdAndUpdate(
            arenaId,
            {
                fieldName,
                ownerName,
                phone,
                startTime,
                endTime,
                location: parsedLocation,
                additionalInfo,
                amenities: JSON.parse(amenities || "[]"), // ถ้า `amenities` เป็น undefined ให้ใช้ []
                images: newImages, // ✅ ใช้รูปภาพใหม่ที่อัปเดต
            },
            { new: true }
        );

        console.log("✅ Arena Updated Successfully:", updatedArena);
        res.status(200).json(updatedArena);
    } catch (error) {
        console.error("❌ Error updating arena:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// ✅ ตรวจสอบว่า export ฟังก์ชันทั้งหมด
module.exports = {
    registerArena,
    getArenaById,
    updateArena,
};
