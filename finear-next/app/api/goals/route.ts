import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { createGoal, FinanceError, listGoals } from "@/lib/services/finance-service";
import { goalSchema } from "@/lib/validation/schemas";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    return NextResponse.json({ success: true, data: await listGoals(user.id) });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = goalSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const goal = await createGoal(user.id, parsed.data);
    return NextResponse.json({ success: true, data: goal, message: "Savings goal created." }, { status: 201 });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
