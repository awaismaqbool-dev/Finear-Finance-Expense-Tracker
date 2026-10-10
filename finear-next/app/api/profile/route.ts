import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { profileNameSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return jsonError("Please sign in.", 401);

    const parsed = profileNameSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);

    const updated = await prisma.user.update({
      where: { id: Number(user.id) },
      data: { name: parsed.data.name },
      select: { id: true, name: true, email: true, isVerified: true, imagePath: true },
    });
    return NextResponse.json({ success: true, data: updated, message: "Name updated." });
  } catch (error) {
    return serverError(error);
  }
}
