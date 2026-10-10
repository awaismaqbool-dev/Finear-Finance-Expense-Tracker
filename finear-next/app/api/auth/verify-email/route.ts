import { NextResponse } from "next/server";
import { assertSessionConfiguration, setSessionCookie } from "@/lib/auth/session";
import { verifyOtp } from "@/lib/services/auth-service";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { otpSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = otpSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    // Check the session signing key before verifyOtp consumes the one-time code.
    assertSessionConfiguration();
    const userId = await verifyOtp(parsed.data.email, parsed.data.otp, "verify");
    if (!userId) return jsonError("The code is invalid or has expired.", 400);
    await setSessionCookie(userId);
    return NextResponse.json({ success: true, message: "Email verified." });
  } catch (error) {
    return serverError(error);
  }
}
