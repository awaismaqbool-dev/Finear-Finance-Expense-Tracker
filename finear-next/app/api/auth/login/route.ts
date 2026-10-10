import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { loginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return jsonError("Email or password is incorrect.", 401);
    }
    if (!user.isVerified) return jsonError("Verify your email before signing in.", 403);

    await setSessionCookie(String(user.id));
    return NextResponse.json({ success: true, message: "Welcome back." });
  } catch (error) {
    return serverError(error);
  }
}
