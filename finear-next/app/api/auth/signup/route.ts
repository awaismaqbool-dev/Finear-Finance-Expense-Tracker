import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { issueOtp } from "@/lib/services/auth-service";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { signupSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const { name, email } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.isVerified) return jsonError("An account with this email already exists.", 409);
    if (existing) {
      const otp = await issueOtp(email, "verify");
      return NextResponse.json({ success: true, message: "A verification code has been sent again.", ...(otp.debugOtp ? { debugOtp: otp.debugOtp } : {}) });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { name, email, passwordHash } });
      await tx.profile.create({ data: { userId: user.id } });
    });

    const otp = await issueOtp(email, "verify");
    return NextResponse.json({
      success: true,
      message: "Account created. Enter the verification code to continue.",
      ...(otp.debugOtp ? { debugOtp: otp.debugOtp } : {}),
    }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
