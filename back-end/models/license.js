import mongoose, { Schema } from 'mongoose';

const licenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'free' },
    expiredDate: { type: Date },
  },
  { timestamps: true }
);

const License = mongoose.model('License', licenseSchema);
export default License;
