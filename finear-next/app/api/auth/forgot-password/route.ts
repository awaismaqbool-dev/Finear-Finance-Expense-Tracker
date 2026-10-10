import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/services/auth-service";
import { serverError, validationError } from "@/lib/api/route-response";
import { emailSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = emailSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    await issueOtp(parsed.data.email, "reset");
    return NextResponse.json({ success: true, message: "If the account exists, a reset code has been sent." });
  } catch (error) {
    return serverError(error);
  }
}
