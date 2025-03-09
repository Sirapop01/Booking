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


// ✅ API ปฏิเสธสนาม
router.delete("/reject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "❌ ID ไม่ถูกต้อง" });
        }

        // ✅ อัปเดตสถานะเจ้าของสนามเป็น "rejected"
        const owner = await BusinessOwner.findByIdAndUpdate(
            id,
            { status: "rejected", rejectReason: reason },
            { new: true }
        );

        if (!owner) {
            return res.status(404).json({ message: "❌ ไม่พบเจ้าของสนาม" });
        }

        // ✅ ลบคำขอใน `BusinessInfoRequest`
        const deletedRequest = await BusinessInfoRequest.findOneAndDelete({ businessOwnerId: id });

        if (!deletedRequest) {
            return res.status(404).json({ message: "❌ ไม่พบคำขออนุมัติที่เกี่ยวข้อง" });
        }

        // ✅ ลบ `Arena` ที่เกี่ยวข้องกับเจ้าของสนามนี้
        await Arena.deleteMany({ businessOwnerId: id });

        // ✅ ส่งอีเมลแจ้งเตือน
        await sendRejectionEmail(owner.email, owner.firstName, reason);

        res.status(200).json({ message: "🚫 ปฏิเสธและลบสนามสำเร็จ!" });

    } catch (error) {
        res.status(500).json({ message: "❌ ไม่สามารถปฏิเสธได้", error: error.message });
    }
});


module.exports = router;
