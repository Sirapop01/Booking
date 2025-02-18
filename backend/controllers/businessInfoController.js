const BusinessInfo = require('../models/BusinessInfo');

exports.submitBusinessInfo = async (req, res) => {
    try {
        const { accountName, bank, accountNumber, businessOwnerId, images } = req.body;

        const existingInfo = await BusinessInfo.findOne({ businessOwnerId });

        if (existingInfo) {
            return res.status(400).json({ message: 'ข้อมูลของเจ้าของธุรกิจนี้มีอยู่แล้วในระบบ' });
        }

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
