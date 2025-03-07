const BusinessInfoRequest = require('../models/BusinessInfoRequest');
const BusinessInfo = require('../models/BusinessInfo');

exports.submitBusinessRequest = async (req, res) => {
    try {
        const { accountName, bank, accountNumber, businessOwnerId, images } = req.body;

        // ✅ ตรวจสอบว่า `businessOwnerId` มีอยู่แล้วในคำร้องหรือไม่
        const existingRequest = await BusinessInfoRequest.findOne({ businessOwnerId });

        if (existingRequest) {
            return res.status(400).json({ message: '❌ คำร้องขอของเจ้าของธุรกิจนี้มีอยู่แล้วในระบบ' });
        }

        // ✅ ตรวจสอบค่า `images` ว่าครบหรือไม่
        if (!images || !images.registration || !images.idCard || !images.idHolder || !images.qrCode) {
            return res.status(400).json({ message: '❌ รูปภาพที่อัปโหลดไม่ครบ กรุณาอัปโหลดใหม่' });
        }

        // ✅ สร้างคำร้องใหม่
        const newRequest = new BusinessInfoRequest({
            accountName,
            bank,
            accountNumber,
            businessOwnerId,
            images,
        });

        await newRequest.save();
        res.status(201).json({ message: '✅ ส่งคำร้องสำเร็จ! โปรดรอการอนุมัติจากแอดมิน', request: newRequest });

    } catch (error) {
        console.error('🚨 Error submitting business request:', error);
        res.status(500).json({ message: '❌ เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
    }
};


// ดึงคำร้องทั้งหมด
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await BusinessInfoRequest.find().populate('businessOwnerId', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงคำร้องขอ', error });
    }
};

// ✅ Admin อนุมัติคำร้อง และย้ายไป BusinessInfo
exports.approveRequest = async (req, res) => {
    try {
        const request = await BusinessInfoRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'ไม่พบคำร้องขอ' });
        }

        // **ย้ายข้อมูลไป BusinessInfo**
        const approvedBusiness = new BusinessInfo({
            accountName: request.accountName,
            bank: request.bank,
            accountNumber: request.accountNumber,
            businessOwnerId: request.businessOwnerId,
            images: request.images,
        });

        await approvedBusiness.save(); // ✅ เพิ่มข้อมูลไปยัง `businessinfos`
        await BusinessInfoRequest.findByIdAndDelete(req.params.id); // ✅ ลบออกจาก `businessInfoRequests`

        res.status(200).json({ message: '✅ อนุมัติคำร้องสำเร็จ! ข้อมูลถูกย้ายไปยัง BusinessInfo' });

    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติ', error: error.message });
    }
};

// ✅ Admin ปฏิเสธคำร้อง
exports.rejectRequest = async (req, res) => {
    try {
        const deletedRequest = await BusinessInfoRequest.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'ไม่พบคำร้องขอ' });
        }
        res.status(200).json({ message: '🚫 ปฏิเสธคำร้องสำเร็จ!' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการปฏิเสธคำร้อง', error: error.message });
    }
};
