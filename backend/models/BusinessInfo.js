const mongoose = require('mongoose');

const businessInfoSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'businessowners', required: true },
    images: {
        registration: { type: String, required: true },
        idCard: { type: String, required: true },
        idHolder: { type: String, required: true },
        qrCode: { type: String, required: true },  // ฟิลด์นี้ต้องไม่ว่าง
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BusinessInfo', businessInfoSchema);
