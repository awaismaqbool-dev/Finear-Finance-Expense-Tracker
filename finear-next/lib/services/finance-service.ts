import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { GoalRecord, ProfileSummary, TransactionRecord, TransactionType, MoneySource } from "@/lib/types/domain";

type TransactionInput = { title: string; amount: number; type: TransactionType; source: MoneySource; category: string };
type BalanceState = { handBalance: bigint; bankBalance: bigint; flexibleSavings: bigint };

export class FinanceError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function withFinancialTransaction<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(operation, { isolationLevel: "Serializable" });
}

function cents(value: unknown, allowNegative = false): bigint {
  const text = String(value);
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) throw new FinanceError("Amount must be a non-negative value with up to two decimal places.");
  if (match[1] === "-" && !allowNegative) throw new FinanceError("Amount must be non-negative.");
  const result = BigInt(match[2]) * BigInt(100) + BigInt((match[3] ?? "").padEnd(2, "0") || "0");
  return match[1] === "-" ? -result : result;
}

function decimal(value: bigint): string {
  const negative = value < BigInt(0);
  const absolute = negative ? -value : value;
  const whole = absolute / BigInt(100);
  const fraction = String(absolute % BigInt(100)).padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

function number(value: unknown): number {
  return Number(value);
}

function databaseId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) throw new FinanceError("Invalid record ID.", 400);
  return id;
}

function fromProfile(profile: { handBalance: unknown; bankBalance: unknown; flexibleSavings: unknown }): BalanceState {
  return {
    handBalance: cents(profile.handBalance, true),
    bankBalance: cents(profile.bankBalance, true),
    flexibleSavings: cents(profile.flexibleSavings, true),
  };
}

function applyTransaction(state: BalanceState, input: { amount: bigint; type: TransactionType; source: MoneySource }, direction: 1 | -1): void {
  const wallet = input.source === "cash" ? "handBalance" : "bankBalance";
  const sign = BigInt(input.type === "income" ? 1 : -1);
  const multiplier = BigInt(direction);
  const walletAfter = state[wallet] + sign * multiplier * input.amount;

  if (direction === 1 && input.type !== "income" && walletAfter < BigInt(0)) {
    throw new FinanceError(`Insufficient ${input.source} balance.`, 400);
  }

  state[wallet] = walletAfter;
  if (input.type === "savings") state.flexibleSavings += multiplier * input.amount;
}

function transactionView(item: {
  id: number; title: string; amount: unknown; type: TransactionType; source: MoneySource; category: string; createdAt: Date;
}): TransactionRecord {
  return { id: String(item.id), title: item.title, amount: number(item.amount), type: item.type, source: item.source, category: item.category, createdAt: item.createdAt.toISOString() };
}

function goalView(item: {
  id: number; goalName: string; targetAmount: unknown; savedAmount: unknown; priority: GoalRecord["priority"]; status: GoalRecord["status"]; createdAt: Date;
}): GoalRecord {
  return { id: String(item.id), goalName: item.goalName, targetAmount: number(item.targetAmount), savedAmount: number(item.savedAmount), priority: item.priority, status: item.status, createdAt: item.createdAt.toISOString() };
}

export async function getDashboard(userId: string) {
  const ownerId = databaseId(userId);
  const [user, profile, totals, recentTransactions, activeGoals] = await Promise.all([
    prisma.user.findUnique({ where: { id: ownerId }, select: { name: true, email: true, imagePath: true } }),
    prisma.profile.findUnique({ where: { userId: ownerId } }),
    prisma.transaction.groupBy({ by: ["type"], where: { userId: ownerId }, _sum: { amount: true } }),
    prisma.transaction.findMany({ where: { userId: ownerId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.goal.findMany({ where: { userId: ownerId, status: "Active" }, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);
  if (!user || !profile) throw new FinanceError("Account profile could not be found.", 404);

  const totalFor = (type: TransactionType) => number(totals.find((item) => item.type === type)?._sum?.amount ?? 0);
  const handBalance = number(profile.handBalance);
  const bankBalance = number(profile.bankBalance);
  const data: ProfileSummary = {
    name: user.name,
    email: user.email,
    imagePath: user.imagePath,
    handBalance,
    bankBalance,
    totalBalance: handBalance + bankBalance,
    flexibleSavings: number(profile.flexibleSavings),
    monthlyBudget: number(profile.monthlyBudget),
    currency: "PKR",
  };

  return {
    profile: data,
    totalIncome: totalFor("income"),
    totalExpense: totalFor("expense"),
    recentTransactions: recentTransactions.map(transactionView),
    activeGoals: activeGoals.map(goalView),
  };
}

export async function listTransactions(userId: string, type?: TransactionType) {
  const ownerId = databaseId(userId);
  const rows = await prisma.transaction.findMany({ where: { userId: ownerId, ...(type ? { type } : {}) }, orderBy: { createdAt: "desc" } });
  const categories = new Map<string, number>();
  for (const row of rows) categories.set(row.category || "Other", (categories.get(row.category || "Other") ?? 0) + number(row.amount));
  return { transactions: rows.map(transactionView), graphData: [...categories].map(([name, value]) => ({ name, value })) };
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const ownerId = databaseId(userId);
  const amount = cents(input.amount);
  return withFinancialTransaction(async (tx) => {
    const profile = await tx.profile.findUnique({ where: { userId: ownerId } });
    if (!profile) throw new FinanceError("Profile not found.", 404);
    const state = fromProfile(profile);
    applyTransaction(state, { amount, type: input.type, source: input.source }, 1);
    const [record] = await Promise.all([
      tx.transaction.create({ data: { userId: ownerId, ...input, amount: decimal(amount) } }),
      tx.profile.update({ where: { userId: ownerId }, data: { handBalance: decimal(state.handBalance), bankBalance: decimal(state.bankBalance), flexibleSavings: decimal(state.flexibleSavings) } }),
    ]);
    return transactionView(record);
  });
}

export async function updateTransaction(userId: string, transactionId: string, input: TransactionInput) {
  const ownerId = databaseId(userId);
  const recordId = databaseId(transactionId);
  return withFinancialTransaction(async (tx) => {
    const oldRecord = await tx.transaction.findFirst({ where: { id: recordId, userId: ownerId } });
    if (!oldRecord) throw new FinanceError("Transaction not found.", 404);
    const profile = await tx.profile.findUnique({ where: { userId: ownerId } });
    if (!profile) throw new FinanceError("Profile not found.", 404);
    const state = fromProfile(profile);
    applyTransaction(state, { amount: cents(oldRecord.amount), type: oldRecord.type, source: oldRecord.source }, -1);
    applyTransaction(state, { amount: cents(input.amount), type: input.type, source: input.source }, 1);
    const [record] = await Promise.all([
      tx.transaction.update({ where: { id: oldRecord.id }, data: { ...input, amount: decimal(cents(input.amount)) } }),
      tx.profile.update({ where: { userId: ownerId }, data: { handBalance: decimal(state.handBalance), bankBalance: decimal(state.bankBalance), flexibleSavings: decimal(state.flexibleSavings) } }),
    ]);
    return transactionView(record);
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const ownerId = databaseId(userId);
  const recordId = databaseId(transactionId);
  return withFinancialTransaction(async (tx) => {
    const record = await tx.transaction.findFirst({ where: { id: recordId, userId: ownerId } });
    if (!record) throw new FinanceError("Transaction not found.", 404);
    const profile = await tx.profile.findUnique({ where: { userId: ownerId } });
    if (!profile) throw new FinanceError("Profile not found.", 404);
    const state = fromProfile(profile);
    applyTransaction(state, { amount: cents(record.amount), type: record.type, source: record.source }, -1);
    await tx.transaction.delete({ where: { id: record.id } });
    await tx.profile.update({ where: { userId: ownerId }, data: { handBalance: decimal(state.handBalance), bankBalance: decimal(state.bankBalance), flexibleSavings: decimal(state.flexibleSavings) } });
  });
}

export async function listGoals(userId: string) {
  const ownerId = databaseId(userId);
  const rows = await prisma.goal.findMany({ where: { userId: ownerId }, orderBy: { createdAt: "desc" } });
  return rows.map(goalView);
}

export async function createGoal(userId: string, input: { goalName: string; targetAmount: number; priority: GoalRecord["priority"] }) {
  const goal = await prisma.goal.create({ data: { userId: databaseId(userId), ...input, targetAmount: decimal(cents(input.targetAmount)) } });
  return goalView(goal);
}

export async function updateGoal(userId: string, goalId: string, input: { goalName: string; targetAmount: number; priority: GoalRecord["priority"] }) {
  const ownerId = databaseId(userId);
  const recordId = databaseId(goalId);
  const result = await prisma.goal.updateMany({ where: { id: recordId, userId: ownerId }, data: { ...input, targetAmount: decimal(cents(input.targetAmount)) } });
  if (!result.count) throw new FinanceError("Goal not found.", 404);
  const goal = await prisma.goal.findFirstOrThrow({ where: { id: recordId, userId: ownerId } });
  return goalView(goal);
}

export async function deleteGoal(userId: string, goalId: string) {
  const ownerId = databaseId(userId);
  const recordId = databaseId(goalId);
  await withFinancialTransaction(async (tx) => {
    const goal = await tx.goal.findFirst({ where: { id: recordId, userId: ownerId } });
    if (!goal) throw new FinanceError("Goal not found.", 404);
    const refund = cents(goal.savedAmount);
    if (refund > BigInt(0)) {
      const profile = await tx.profile.findUnique({ where: { userId: ownerId } });
      if (!profile) throw new FinanceError("Profile not found.", 404);
      await tx.profile.update({ where: { userId: ownerId }, data: { flexibleSavings: decimal(cents(profile.flexibleSavings) + refund) } });
      await tx.transaction.create({
        data: { userId: ownerId, title: `Refund: ${goal.goalName} deleted`, amount: decimal(refund), type: "savings", source: "cash", category: "Goal Refund" },
      });
    }
    await tx.goal.delete({ where: { id: goal.id } });
  });
}

export async function contributeToGoal(userId: string, goalId: string, amountValue: number, source: MoneySource) {
  const ownerId = databaseId(userId);
  const recordId = databaseId(goalId);
  const amount = cents(amountValue);
  return withFinancialTransaction(async (tx) => {
    const [goal, profile] = await Promise.all([
      tx.goal.findFirst({ where: { id: recordId, userId: ownerId } }),
      tx.profile.findUnique({ where: { userId: ownerId } }),
    ]);
    if (!goal) throw new FinanceError("Goal not found.", 404);
    if (!profile) throw new FinanceError("Profile not found.", 404);
    if (goal.status === "Completed") throw new FinanceError("Goal has already been achieved.");

    const wallet = source === "cash" ? "handBalance" : "bankBalance";
    const state = fromProfile(profile);
    if (state[wallet] < amount) throw new FinanceError(`Insufficient ${source} balance.`);
    const saved = cents(goal.savedAmount) + amount;
    const target = cents(goal.targetAmount);
    if (saved > target) throw new FinanceError(`You only need ${decimal(target - cents(goal.savedAmount))} PKR to reach this goal.`);

    await Promise.all([
      tx.goal.update({ where: { id: goal.id }, data: { savedAmount: decimal(saved), status: saved === target ? "Completed" : "Active" } }),
      tx.profile.update({ where: { userId: ownerId }, data: { [wallet]: decimal(state[wallet] - amount) } }),
      tx.transaction.create({ data: { userId: ownerId, title: `Saved for ${goal.goalName}`, amount: decimal(amount), type: "savings", source, category: "Goal" } }),
    ]);
  });
}

export async function withdrawFlexibleSavings(userId: string, amountValue: number, targetSource: MoneySource) {
  const ownerId = databaseId(userId);
  const amount = cents(amountValue);
  return withFinancialTransaction(async (tx) => {
    const profile = await tx.profile.findUnique({ where: { userId: ownerId } });
    if (!profile) throw new FinanceError("Profile not found.", 404);
    const state = fromProfile(profile);
    if (state.flexibleSavings < amount) throw new FinanceError("Savings do not have enough funds.");
    const wallet = targetSource === "bank" ? "bankBalance" : "handBalance";
    await Promise.all([
      tx.profile.update({ where: { userId: ownerId }, data: { flexibleSavings: decimal(state.flexibleSavings - amount), [wallet]: decimal(state[wallet] + amount) } }),
      tx.transaction.create({ data: { userId: ownerId, title: "Withdrawn from savings", amount: decimal(amount), type: "income", source: targetSource, category: "Savings Withdraw" } }),
    ]);
  });
}

export async function setMonthlyBudget(userId: string, budget: number) {
  const result = await prisma.profile.updateMany({ where: { userId: databaseId(userId) }, data: { monthlyBudget: decimal(cents(budget)) } });
  if (!result.count) throw new FinanceError("Profile not found.", 404);
}

