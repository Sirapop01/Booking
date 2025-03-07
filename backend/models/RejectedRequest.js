const mongoose = require("mongoose");

const rejectedRequestSchema = new mongoose.Schema({
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
    rejectReason: { type: String, required: true },
    rejectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RejectedRequest", rejectedRequestSchema);
