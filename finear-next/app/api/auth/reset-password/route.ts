import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyOtp } from "@/lib/services/auth-service";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { resetPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = resetPasswordSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const userId = await verifyOtp(parsed.data.email, parsed.data.otp, "reset");
    if (!userId) return jsonError("The code is invalid or has expired.", 400);
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, resetOtpHash: null, resetOtpExpiry: null },
    });
    return NextResponse.json({ success: true, message: "Password updated. You can sign in now." });
  } catch (error) {
    return serverError(error);
  }
}
