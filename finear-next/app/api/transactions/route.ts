import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { jsonError, serverError, validationError } from "@/lib/api/route-response";
import { FinanceError, createTransaction, deleteTransaction, listTransactions, updateTransaction } from "@/lib/services/finance-service";
import { transactionSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const transactionTypeSchema = z.enum(["income", "expense", "savings"]);
const updateSchema = transactionSchema.extend({ transactionId: z.string().min(1) });
const deleteSchema = z.object({ transactionId: z.string().min(1) });

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  const value = new URL(request.url).searchParams.get("type");
  const parsed = value ? transactionTypeSchema.safeParse(value) : undefined;
  if (parsed && !parsed.success) return jsonError("Invalid transaction type.");
  try {
    return NextResponse.json({ success: true, data: await listTransactions(user.id, parsed?.data) });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = transactionSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const transaction = await createTransaction(user.id, parsed.data);
    return NextResponse.json({ success: true, data: transaction, message: "Transaction added." }, { status: 201 });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    const { transactionId, ...input } = parsed.data;
    const transaction = await updateTransaction(user.id, transactionId, input);
    return NextResponse.json({ success: true, data: transaction, message: "Transaction updated." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Please sign in.", 401);
  try {
    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error);
    await deleteTransaction(user.id, parsed.data.transactionId);
    return NextResponse.json({ success: true, message: "Transaction deleted." });
  } catch (error) {
    if (error instanceof FinanceError) return jsonError(error.message, error.status);
    return serverError(error);
  }
}
