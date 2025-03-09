const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ นำเข้า mongoose
const BusinessOwner = require("../models/BusinessOwner"); // ✅ ต้อง import Model ของ BusinessOwner
const BusinessInfoRequest = require("../models/BusinessInfoRequest");
const Arena = require("../models/Arena"); // ✅ Import Arena Model
const { sendEmailNotification, sendApprovalEmail, sendRejectionEmail } = require("../controllers/notificationController");

// ✅ Route สำหรับส่ง Email แจ้งเตือน
router.post("/send-email", sendEmailNotification);
router.post("/notify/approve", sendApprovalEmail); // ✅ เพิ่ม API แจ้งเตือนการอนุมัติ
router.post("/notify/reject", sendRejectionEmail);

// ✅ Route สำหรับอนุมัติสนาม
// ✅ API อนุมัติสนาม
router.put("/approve/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "❌ ID ไม่ถูกต้อง" });
        }

        // ✅ อัปเดตสถานะเจ้าของสนามเป็น "approved"
        const owner = await BusinessOwner.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        if (!owner) {
            return res.status(404).json({ message: "❌ ไม่พบเจ้าของสนาม" });
        }

        // ✅ ลบคำขออนุมัติใน BusinessInfoRequest
        const deletedRequest = await BusinessInfoRequest.findOneAndDelete({ businessOwnerId: id });

        if (!deletedRequest) {
            return res.status(404).json({ message: "❌ ไม่พบคำขออนุมัติที่เกี่ยวข้อง" });
        }

        // ✅ ส่งอีเมลแจ้งเตือน
        await sendApprovalEmail(owner.email, owner.firstName);

        res.status(200).json({ message: "✅ อนุมัติสำเร็จ!", owner });

    } catch (error) {
        res.status(500).json({ message: "❌ ไม่สามารถอนุมัติได้", error: error.message });
    }
});

router.delete("/reject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, arenaId } = req.body; // ✅ ดึงค่า arenaId และ reason ที่ส่งมาจาก frontend

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(arenaId)) {
            return res.status(400).json({ message: "❌ ID ไม่ถูกต้อง" });
        }

        // ✅ ค้นหาข้อมูลเจ้าของสนามและคำขอ
        const request = await BusinessInfoRequest.findById(id).populate("businessOwnerId", "email firstName");
        if (!request) {
            return res.status(404).json({ message: "❌ ไม่พบคำขออนุมัติที่เกี่ยวข้อง" });
        }

        // ✅ ค้นหาและลบ Arena ตาม arenaId เท่านั้น
        const deletedArena = await Arena.findByIdAndDelete(arenaId);
        if (!deletedArena) {
            return res.status(404).json({ message: "❌ ไม่พบสนามที่ต้องการลบ" });
        }

        // ✅ ลบคำขอใน BusinessInfoRequest
        await BusinessInfoRequest.findByIdAndDelete(id);

        // ✅ ส่งอีเมลแจ้งเตือน
        if (request.businessOwnerId.email) {
            await sendRejectionEmail(request.businessOwnerId.email, request.businessOwnerId.firstName, reason);
            console.log("✅ อีเมลแจ้งเตือนการปฏิเสธถูกส่งไปที่:", request.businessOwnerId.email);
        } else {
            console.warn("⚠️ ไม่มีอีเมลของเจ้าของสนาม ไม่สามารถส่งอีเมลแจ้งเตือนได้");
        }

        res.status(200).json({ message: "🚫 ปฏิเสธคำร้องสำเร็จ! ลบสนามเรียบร้อย และส่งอีเมลแจ้งเตือน" });

    } catch (error) {
        console.error("🚨 Error rejecting request:", error);
        res.status(500).json({ message: "❌ ไม่สามารถปฏิเสธได้", error: error.message });
    }
});




module.exports = router;
