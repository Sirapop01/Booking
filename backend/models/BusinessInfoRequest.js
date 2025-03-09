const mongoose = require("mongoose");

const businessInfoRequestSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true },
    images: {
        registration: { type: String, required: true },
        idCard: { type: String, required: true },
        idHolder: { type: String, required: true },
        qrCode: { type: String, required: true },
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // ✅ เพิ่มสถานะ
    rejectReason: { type: String, default: "" }, // ✅ เพิ่มฟิลด์เก็บเหตุผลที่ถูกปฏิเสธ
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BusinessInfoRequest", businessInfoRequestSchema);
