// models/PaymentLog.js
const mongoose = require('mongoose');

const paymentLog = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String, // PENDING, SUCCESS, FAILURE, ERROR
      required: true,
    },
    paymentDay: {
      // Ngày thanh toán (dùng Date/ISO format)
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Thêm createdAt/updatedAt mặc định

module.exports = mongoose.model('PaymentLog', paymentLog);
