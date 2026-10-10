import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { contributeToGoal, FinanceError } from "@/lib/services/finance-service";
import { amountSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const schema = amountSchema.extend({ goalId: z.string().min(1), source: z.enum(["cash", "bank"]) });

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const { goalId, amount, source } = parsed.data;
    await contributeToGoal(user.id, goalId, amount, source);
    return NextResponse.json({ success: true, message: "Goal contribution added." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
