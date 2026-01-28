import express from "express";

import { chnagePassword, login, logout, reSendOtp, sendOtp, signup, verifyEmail, verifyOtpForget } from "../controllers/authController.js";
import authMiddelWear from "../middelWare/authMiddelWear.js";

const authRouters = express.Router();

authRouters.post("/register", signup);
authRouters.post("/login", login);
authRouters.post("/logout", logout);
authRouters.post("/send-otp", authMiddelWear,sendOtp);
authRouters.post("/verify-email",authMiddelWear,verifyEmail);
authRouters.post("/resend-otp", reSendOtp);
authRouters.post("/forget-pasword", reSendOtp);
authRouters.post("/verify-otp",verifyOtpForget);
authRouters.post("/change-Password", chnagePassword);
export default authRouters;