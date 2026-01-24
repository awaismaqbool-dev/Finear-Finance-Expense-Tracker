import userModel from "../userModels/usermodel.js";
import bcryptjs from "bcryptjs";

import jwt from "jsonwebtoken";



// signup api
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      massage: "Missing Details",
    });
  }
  try {
    const exitEmail = await userModel.findone({ email });
    if (exitEmail) {
      return res.json({
        success: false,
        massage: "User Already Exist",
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


  } catch (error) {

  }
};
