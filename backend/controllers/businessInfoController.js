const BusinessInfo = require('../models/BusinessInfo');
const path = require('path');

exports.submitBusinessInfo = async (req, res) => {
    try {
        const { accountName, bank, accountNumber, businessOwnerId, images } = req.body;

        // Log the incoming data for debugging
        console.log('Received Data:', req.body);

        // ✅ เช็คว่ามี businessOwnerId นี้อยู่แล้วใน BusinessInfo หรือไม่
        const existingInfo = await BusinessInfo.findOne({ businessOwnerId });

        if (existingInfo) {
            return res.status(400).json({ message: 'ข้อมูลของเจ้าของธุรกิจนี้มีอยู่แล้วในระบบ' });
        }
        

        // ถ้ายังไม่มี ให้บันทึกข้อมูลใหม่
        const newInfo = new BusinessInfo({
            accountName,
            bank,
            accountNumber,
            businessOwnerId,
            images,
        });

        await newInfo.save();
        res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ!' });
        
    } catch (error) {
        console.error('🚨 Error submitting business information:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', error: error.message });
    }
};

