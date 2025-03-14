const mongoose = require("mongoose");

const businessOwnerSchema = new mongoose.Schema({
    idCard: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    acceptTerms: { type: Boolean, required: true }, // ✅ ต้องกำหนดค่า acceptTerms
    role: { type: String, default: "business_owner" },
    status: { type: String, enum: ["active", "blacklisted"], default: "active" }
});


module.exports = mongoose.model("BusinessOwner", businessOwnerSchema);
