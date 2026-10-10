import "server-only";
import nodemailer from "nodemailer";

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SENDER_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SENDER_EMAIL) return false;

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({ from: SENDER_EMAIL, ...message });
  return true;
}

export function otpEmail(name: string, otp: string, purpose: "verify" | "reset"): EmailMessage {
  const action = purpose === "verify" ? "verify your email address" : "reset your password";
  return {
    to: "",
    subject: purpose === "verify" ? "Your Finear verification code" : "Your Finear password reset code",
    html: `<div style="font-family:Arial,sans-serif;color:#17211d;max-width:520px;margin:auto"><h1>Finear</h1><p>Hi ${escapeHtml(name)}, use this code to ${action}:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#117b59">${otp}</p><p>This code expires in 30 minutes. If you did not request it, you can ignore this email.</p></div>`,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character] ?? character;
  });
}
