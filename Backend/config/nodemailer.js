import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ensure env loaded

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
