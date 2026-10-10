import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { FinanceError, withdrawFlexibleSavings } from "@/lib/services/finance-service";
import { amountSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const schema = amountSchema.extend({ targetSource: z.enum(["cash", "bank"]) });

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    await withdrawFlexibleSavings(user.id, parsed.data.amount, parsed.data.targetSource);
    return NextResponse.json({ success: true, message: "Savings transferred to your account balance." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
