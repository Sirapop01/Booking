const BusinessOwner = require("../models/BusinessOwner");

// 📌 ดึงเฉพาะบัญชีที่เป็นเจ้าของสนาม (business_owner)
exports.getAllOwners = async (req, res) => {
    try {
        const owners = await BusinessOwner.find({ role: "business_owner" }); // ✅ กรองเฉพาะเจ้าของสนาม
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเจ้าของสนาม" });
    }
};

// 📌 ลบบัญชีเจ้าของสนาม
exports.deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;
        await BusinessOwner.findByIdAndDelete(id);
        res.status(200).json({ message: "ลบบัญชีเจ้าของสนามเรียบร้อยแล้ว" });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบบัญชีเจ้าของสนาม" });
    }
};

// 📌 เปลี่ยนสถานะบัญชี (Blacklist / Unblacklist)
exports.toggleBlacklistOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await BusinessOwner.findById(id);

        if (!owner) {
            return res.status(404).json({ error: "ไม่พบเจ้าของสนาม" });
        }

        // ✅ สลับค่า "status" ระหว่าง "approved" และ "blacklisted"
        owner.status = owner.status === "blacklisted" ? "approved" : "blacklisted";
        await owner.save();

        res.status(200).json({ message: "เปลี่ยนสถานะบัญชีเจ้าของสนามเรียบร้อยแล้ว", status: owner.status });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะบัญชี" });
    }
};
