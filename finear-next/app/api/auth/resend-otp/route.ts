import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { issueOtp } from "@/lib/services/auth-service";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { emailSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = emailSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || user.isVerified) return jsonError("A verification code cannot be sent for this account.", 400);
    await issueOtp(user.email, "verify");
    return NextResponse.json({ success: true, message: "A new code has been sent." });
  } catch (error) {
    return serverError(error);
  }
}
