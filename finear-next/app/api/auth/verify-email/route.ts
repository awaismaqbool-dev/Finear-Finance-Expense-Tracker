import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { verifyOtp } from "@/lib/services/auth-service";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { otpSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = otpSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const userId = await verifyOtp(parsed.data.email, parsed.data.otp, "verify");
    if (!userId) return jsonError("The code is invalid or has expired.", 400);
    await setSessionCookie(userId);
    return NextResponse.json({ success: true, message: "Email verified." });
  } catch (error) {
    return serverError(error);
  }
}
