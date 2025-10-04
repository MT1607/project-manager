import mongoose, { Schema } from 'mongoose';

const paymentLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

const PaymentLog = mongoose.model('PaymentLog', paymentLogSchema);
export default PaymentLog;
