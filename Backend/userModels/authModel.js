import mongoose from "mongoose";

const authSachema= mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
verifyOtp: { type: Number, default:0},
restOtp: { type: Number, default:0},
otpExpireAt:{type: Number , default: 0},
isVerified: { type: Boolean , default: false },


});
const userModel = mongoose.model('user', authSachema);
export default userModel;