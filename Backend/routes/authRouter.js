import express from "express";

import { chnagePassword, login, logout, forgetPassword, sendOtp, signup, verifyEmail, verifyOtpForget } from "../controllers/authController.js";
import authMiddelWear from "../middelWare/authMiddelWear.js";

const authRouters = express.Router();

authRouters.post("/register", signup);
authRouters.post("/login", login);
authRouters.post("/logout", logout);
authRouters.post("/send-otp", authMiddelWear,sendOtp);
authRouters.post("/verify-email",authMiddelWear,verifyEmail);
authRouters.post("/resend-otp", authMiddelWear,sendOtp);
authRouters.post("/forget-pasword", forgetPassword);
authRouters.post("/verify-otp",verifyOtpForget);
authRouters.post("/change-Password", chnagePassword);
export default authRouters;