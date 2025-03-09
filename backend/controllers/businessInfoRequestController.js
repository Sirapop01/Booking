const BusinessInfoRequest = require("../models/BusinessInfoRequest");
const BusinessInfo = require("../models/BusinessInfo");
const RejectedRequest = require("../models/RejectedRequest");
const BusinessOwner = require("../models/BusinessOwner");
const Arena = require('../models/Arena');
const jwt = require("jsonwebtoken");

// ✅ ส่งคำร้องไปยัง BusinessInfoRequest
exports.submitBusinessRequest = async (req, res) => {
    try {
        console.log("📩 Data received from Frontend:", req.body); // ✅ ตรวจสอบค่าที่ถูกส่งจาก Frontend

        const { accountName, bank, accountNumber, businessOwnerId, images } = req.body;

        if (!accountName || !bank || !accountNumber || !businessOwnerId || !images) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
        }

        // ✅ ตรวจสอบว่า businessOwnerId มีอยู่ในฐานข้อมูลจริงหรือไม่
        const ownerExists = await BusinessOwner.findById(businessOwnerId);
        if (!ownerExists) {
            return res.status(400).json({ message: "❌ ไม่พบเจ้าของธุรกิจนี้" });
        }

        const newRequest = new BusinessInfoRequest({
            accountName,
            bank,
            accountNumber,
            businessOwnerId,
            images,
            status: "pending",
            createdAt: new Date(),
        });

        await newRequest.save();
        console.log("✅ Request saved to MongoDB:", newRequest); 

        res.status(201).json({ message: "✅ ส่งคำร้องสำเร็จ!", request: newRequest });

    } catch (error) {
        console.error("🚨 Error saving request:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", error: error.message });
    }
};

// ✅ ดึงเฉพาะคำร้องที่ยังไม่ได้รับการอนุมัติ (`status: pending`)
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await BusinessInfoRequest.find({ status: "pending" })
            .populate("businessOwnerId", "firstName lastName email idCard phoneNumber"); // ✅ ดึงข้อมูลเจ้าของสนาม
        res.status(200).json(requests);
    } catch (error) {
        console.error("🚨 Error fetching pending requests:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: error.message });
    }
};

// ✅ อนุมัติคำร้อง และย้ายไป BusinessInfo
exports.approveRequest = async (req, res) => {
    try {
        // ✅ ตรวจสอบสิทธิ์ (Admin หรือ Superadmin เท่านั้น)
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "❌ ไม่พบ Token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin" && decoded.role !== "superadmin") {
            return res.status(403).json({ message: "🚫 ไม่มีสิทธิ์เข้าถึง" });
        }

        const request = await BusinessInfoRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "❌ ไม่พบคำร้องขอ" });
        }

        // ✅ ย้ายข้อมูลไป BusinessInfo
        const approvedBusiness = new BusinessInfo({
            accountName: request.accountName,
            bank: request.bank,
            accountNumber: request.accountNumber,
            businessOwnerId: request.businessOwnerId,
            images: request.images,
            createdAt: new Date(),
        });

        await approvedBusiness.save(); // ✅ เพิ่มข้อมูลไปยัง `businessinfos`
        await BusinessInfoRequest.findByIdAndDelete(req.params.id); // ✅ ลบออกจาก `businessInfoRequests`

        console.log(`✅ คำร้อง ${req.params.id} ถูกอนุมัติ และย้ายไป BusinessInfo`);

        res.status(200).json({ message: "✅ อนุมัติคำร้องสำเร็จ! ข้อมูลถูกย้ายไปยัง BusinessInfo" });

    } catch (error) {
        console.error("🚨 Error approving request:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการอนุมัติ", error: error.message });
    }
};

// ✅ ปฏิเสธคำร้อง พร้อมระบุเหตุผล
exports.rejectRequest = async (req, res) => {
    try {
        const { reason } = req.body;
        const requestId = req.params.id;

        console.log("📩 Reject Request Received:", requestId, "Reason:", reason);

        if (!reason) {
            return res.status(400).json({ message: "❌ กรุณาระบุเหตุผลในการปฏิเสธ" });
        }

        // ✅ ค้นหาคำร้องที่ถูกปฏิเสธ
        const request = await BusinessInfoRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "❌ ไม่พบคำร้องขอ" });
        }

        const businessOwnerId = request.businessOwnerId; // ✅ ดึง `businessOwnerId`
        console.log("🔍 businessOwnerId ที่ต้องลบสนาม:", businessOwnerId);

        // ✅ ย้ายข้อมูลไป Collection `RejectedRequests`
        const rejectedData = new RejectedRequest({
            accountName: request.accountName,
            bank: request.bank,
            accountNumber: request.accountNumber,
            businessOwnerId: businessOwnerId,
            images: request.images,
            rejectReason: reason
        });
        await rejectedData.save();

        // ✅ ลบคำร้องออกจาก `businessInfoRequests`
        await BusinessInfoRequest.findByIdAndDelete(requestId);

        // ✅ ลบ Arena ที่เป็นของ `businessOwnerId`
        const relatedArenas = await Arena.find({ businessOwnerId });
        console.log("🔍 สนามที่เกี่ยวข้อง:", relatedArenas);

        if (relatedArenas.length > 0) {
            const deletedArenas = await Arena.deleteMany({ businessOwnerId });
            console.log("✅ ลบสนามที่เกี่ยวข้อง:", deletedArenas.deletedCount, "รายการ");
        } else {
            console.warn("⚠️ ไม่พบสนามที่เกี่ยวข้องกับ ownerId:", businessOwnerId);
        }

        res.status(200).json({ message: "🚫 ปฏิเสธคำร้องสำเร็จ! ลบสนามเรียบร้อย แต่เก็บบัญชีเจ้าของไว้" });

    } catch (error) {
        console.error("🚨 Error rejecting request:", error);
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาดในการปฏิเสธคำร้อง", error: error.message });
    }
};
