import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {type: String},
    isEmailVerified: {type: Boolean, default: false},
    lastLogin: {type: Date},
    is2FAEnable: {type: Boolean, default: false},
    twoFAOtp: {type: String, select: false},
    twoFAOtpExpires: {type: String, select: false},
});

const User = mongoose.model('User', userSchema);
export default User;