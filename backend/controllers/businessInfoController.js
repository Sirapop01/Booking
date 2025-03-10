const BusinessInfoRequest = require('../models/BusinessInfoRequest');

// ✅ เปลี่ยนให้เพิ่มข้อมูลลง `businessInfoRequests` แทน
exports.submitBusinessInfo = async (req, res) => {
    try {
        const { accountName, bank, accountNumber, businessOwnerId, images } = req.body;

        // ตรวจสอบว่ามีคำร้องขออยู่แล้วหรือไม่
        const existingRequest = await BusinessInfoRequest.findOne({ businessOwnerId });

        if (existingRequest) {
            return res.status(400).json({ message: 'คำร้องขอของเจ้าของธุรกิจนี้มีอยู่แล้วในระบบ' });
        }

        // สร้างคำร้องใหม่
        const newRequest = new BusinessInfoRequest({
            accountName,
            bank,
            accountNumber,
            businessOwnerId,
            images,
        });

        await newRequest.save();
        res.status(201).json({ message: 'ส่งคำร้องสำเร็จ! โปรดรอการอนุมัติจากแอดมิน', request: newRequest });

    } catch (error) {
        console.error('🚨 Error submitting business request:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งคำร้อง', error: error.message });
    }
};


