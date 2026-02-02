import userModel from "../userModels/authModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import getEmailTemplete, { getOtpTemplete } from "../helper/emailTemplate.js";
import nodemailer from 'nodemailer';
import transporter from '../config/nodemailer.js';
import profileModel from "../userModels/profileModel.js";

// signup api 
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const exitEmail = await userModel.findOne({ email });
    if (exitEmail) {
      return res.json({
        success: false,
        message: "User Already Exist",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 13);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await user.save();
    // new profile making
    const profile = new profileModel({
        userId: user._id
      });
      await profile.save();
    //jwt token code
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

// nodemailer code
const emailTemplate=getEmailTemplete(name);
const mailInfo={
  from:process.env.SENDER_EMAIL,
  to:user.email,
  subject: "Welcome Note",
  html:emailTemplate,
};
const info= await transporter.sendMail(mailInfo);
console.log("Message ID:", info.messageId);
console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
return res.json({
  success: true,
      message: "Registered Successfully and Mail Sent",
      mailId: info.messageId,
      isVerified: user.isVerified,
});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// login Api
export const login= async (req,res)=>{
const {email, password } = req.body;
if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
try {
  const existUser = await userModel.findOne({email});
  if(!existUser){
    return res.json({ success: false, message: "User not found" });
  }
  const isMatch = await bcryptjs.compare(password, existUser.password);
  if(!isMatch){
    return res.json({ success: false, message: "Incorrect Password"});
  }
      //jwt token code
    const token = jwt.sign({id:existUser._id}, process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success:true, message:"Login Successfully", 
      userData:{
        id:existUser._id,
        name:existUser.name,
        email:existUser.email,
        isAccountVerified:existUser.isAccountVerified
      }
    });
} catch (error) {
  res.json({ success: false, message: error.message });
}
};

//Logout Api
export const logout= async (req,res)=>{
  try {
    res.clearCookie("token",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success:true, message:"Logout Successfully"});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// send Opt For Verification Api
export const sendOtp= async (req, res)=>{
try {
const {userId} = req.body; 
    const user = await userModel.findById(userId);
  if(!user){
return res.json({
      success: false,
      message: "User Not Found",
    });
  }
  if(user.isAccountVerified){
    return res.json({
      success: false,
      message: "User Already Verified",
    });
  }
  user.verifyOtp= String(Math.floor(100000 + Math.random() * 900000));
  user.otpExpireAt = Date.now() + 30 * 60 * 1000; // valid code for 30 minutes 
  await user.save();
  // nodemailer code
const otpTemplate=getOtpTemplete(user.name, user.verifyOtp)
const mailInfo={
  from:process.env.SENDER_EMAIL,
  to:user.email,
  subject: "Otp For Email Varification",
  html:otpTemplate,
};
const info = await transporter.sendMail(mailInfo);
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
return res.json({
  success: true,
      message: "OTP sent to your email successfully"
});

} catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
}

};

// verify account api
export const verifyEmail= async (req,res)=>{
  const {userId, otp } = req.body;

  if (!userId ||!otp) {
    return res.json({ success: false, message: "Missing Deatails" });
  }
try {
  const user = await userModel.findById(userId);
  if (!user) {
    return res.json({
        success: false,
        message: "user not found please login again",});
  }
  if(user.isVerified){
          return res.json({
        success: false,
        message: "Your Acount is already varified",
      });
  }
  if(user.verifyOtp != otp || otp === ""|| user.verifyOtp == "" ){

        return res.json({
        success: false,
        message: "Wrong Otp, please Enter Correcrt Otp",});
  }
  
  if (user.otpExpireAt < Date.now()) {
    return res.json({
        success: false,
        message: "Otp Expried",});
  }
  user.isVerified=true;
  user.otpExpireAt=0;
  user.verifyOtp=0;
  await user.save();
  return res.json({
    success:true,
    message:"Your Account Is verified"
  });
} catch (error) {
  res.json({ success: false, message: error.message });
}
};
// send Opt For forgetPassword and Resend opt if otp failed or time out Api
export const forgetPassword= async (req, res)=>{
  const {email}= req.body;
  if(!email){
return res.json({
      success: false,
      message: "Missing Detailes",
    });
  }
try {
  const user =  await userModel.findOne({email});
  if(!user){
return res.json({
      success: false,
      message: "user not found",
    });
  }
  user.restOtp= String(Math.floor(100000 + Math.random() * 900000));
  user.otpExpireAt = Date.now() + 30 * 60 * 1000; // valid code for 30 minutes 
  await user.save();
  // nodemailer code
const otpTemplate=getOtpTemplete(user.name, user.restOtp)
const mailInfo={
  from:process.env.SENDER_EMAIL,
  to:user.email,
  subject: "Otp For Email Varification",
  html:otpTemplate,
};
const info= await transporter.sendMail(mailInfo);
console.log("Message ID:", info.messageId);
console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
return res.json({
  success: true,
      message: "OTP sent to your email successfully"
});

} catch (error) {
  console.error("OTP Error:", error);
  res.json({ success: false, message: error.message });
}

};
// verify verifyOtpForget account api
export const verifyOtpForget= async (req,res)=>{
  const {otp, email } = req.body;
  if (!email ||!otp) {
    return res.json({ success: false, message: "Missing Deatails" });
  }
try {
  const user = await userModel.findOne({email: email});
  if (!user) {
    return res.json({
        success: false,
        message: "user not found",});
  }
  if(user.restOtp != otp || otp === ""|| user.restOtp == "" ){

        return res.json({
        success: false,
        message: "Wrong Otp, please Enter Correcrt Otp",});
  }
  if (user.otpExpireAt < Date.now()) {
    return res.json({
        success: false,
        message: "Setion Time out, Please Send Otp Again",});
  }
  user.otpExpireAt=0;
  user.verifyOtp=0;
  await user.save();
  return res.json({
    success:true,
    message:"Otp Matched, you can changed your Password"
  });
} catch (error) {
  res.json({ success: false, message: error.message });
}
};
// chnage password api

export const chnagePassword = async (req, res) => {
  const {email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 13);
    user.password=hashedPassword;
    await user.save();
    //jwt token code
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
        return res.json({
      success: true,
      message: "password has been chnaged successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
