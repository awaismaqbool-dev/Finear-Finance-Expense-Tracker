import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { FinanceError, setMonthlyBudget } from "@/lib/services/finance-service";
import { budgetSchema } from "@/lib/validation/schemas";

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = budgetSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    await setMonthlyBudget(user.id, parsed.data.budget);
    return NextResponse.json({ success: true, message: "Monthly budget updated." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
