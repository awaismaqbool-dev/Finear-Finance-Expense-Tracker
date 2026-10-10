import "server-only";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { otpEmail, sendEmail } from "@/lib/services/email-service";

type OtpPurpose = "verify" | "reset";

export async function issueOtp(email: string, purpose: OtpPurpose): Promise<{ debugOtp?: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return {};

  const otp = String(randomInt(100000, 1000000));
  const otpHash = await bcrypt.hash(otp, 10);
  const expiry = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: purpose === "verify"
      ? { verificationOtpHash: otpHash, verificationOtpExpiry: expiry }
      : { resetOtpHash: otpHash, resetOtpExpiry: expiry },
  });

  const emailMessage = otpEmail(user.name, otp, purpose);
  const delivered = await sendEmail({ ...emailMessage, to: user.email });
  if (!delivered && process.env.NODE_ENV === "production") {
    throw new Error("SMTP settings are required to send authentication codes in production.");
  }

  return process.env.NODE_ENV === "production" ? {} : { debugOtp: otp };
}

export async function verifyOtp(email: string, otp: string, purpose: OtpPurpose): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const hash = purpose === "verify" ? user.verificationOtpHash : user.resetOtpHash;
  const expiry = purpose === "verify" ? user.verificationOtpExpiry : user.resetOtpExpiry;
  if (!hash || !expiry || expiry.getTime() < Date.now()) return null;
  if (!(await bcrypt.compare(otp, hash))) return null;

  if (purpose === "verify") {
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationOtpHash: null, verificationOtpExpiry: null },
    });
  } else {
    return user.id;
  }

  return user.id;
}
