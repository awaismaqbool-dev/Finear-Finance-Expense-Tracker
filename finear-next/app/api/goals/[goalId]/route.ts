import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { deleteGoal, FinanceError, updateGoal } from "@/lib/services/finance-service";
import { goalSchema } from "@/lib/validation/schemas";

type GoalContext = { params: Promise<{ goalId: string }> };

export async function PATCH(request: Request, context: GoalContext) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = goalSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const { goalId } = await context.params;
    const goal = await updateGoal(user.id, goalId, parsed.data);
    return NextResponse.json({ success: true, data: goal, message: "Goal updated." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: GoalContext) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const { goalId } = await context.params;
    await deleteGoal(user.id, goalId);
    return NextResponse.json({ success: true, message: "Goal deleted." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
