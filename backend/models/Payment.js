const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  arenaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Arena' },
  dateTime: Date,
  item: String,
  amount: Number,
  tax: Number,
  total: Number,
  slipImageUrl: String,
  rejectReason: String,
  status: String,
  state: String,
});

const Payment = mongoose.model('Payment', paymentSchema, 'Payment'); // กำหนดชื่อ collection ชัดเจน

module.exports = Payment;
