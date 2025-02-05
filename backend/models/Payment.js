const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateTime: { type: Date, default: Date.now },
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    rejectReason: { type: String, default: "" },
    slipImageUrl: { type: String } // URL ของสลิปโอนเงิน
});

module.exports = mongoose.model("Payment", PaymentSchema);
