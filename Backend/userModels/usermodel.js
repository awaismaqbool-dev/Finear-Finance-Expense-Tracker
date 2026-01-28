import mongoose from "mongoose";

const userSachema= mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
verifyOtp: { type: Number, default:"" },
restOtp: { type: Number, default: ""},
optExpireAt:{type: Number , default: 0},
isVerified: { type: Boolean , default: false },


});
const userModel = mongoose.model('user', userSachema);
export default userModel;