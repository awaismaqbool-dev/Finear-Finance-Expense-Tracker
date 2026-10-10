import { z } from "zod";

const strongPassword = z
  .string()
  .min(5, "Password must be at least 5 characters")
  .max(72, "Password is too long");

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(191),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(191),
  password: z.string().min(1).max(72),
});

export const otpSchema = z.object({
  email: z.string().trim().email().max(191),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const emailSchema = z.object({ email: z.string().trim().email().max(191) });

export const profileNameSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email().max(191),
  otp: z.string().regex(/^\d{6}$/),
  password: strongPassword,
});

export const transactionSchema = z.object({
  title: z.string().trim().min(1).max(191),
  amount: z.coerce.number().positive().finite().max(9999999999.99),
  type: z.enum(["income", "expense", "savings"]),
  source: z.enum(["cash", "bank"]),
  category: z.string().trim().min(1).max(100).default("general"),
});

export const goalSchema = z.object({
  goalName: z.string().trim().min(1).max(191),
  targetAmount: z.coerce.number().positive().finite().max(9999999999.99),
  priority: z.enum(["high", "medium", "low"]),
});

export const amountSchema = z.object({
  amount: z.coerce.number().positive().finite().max(9999999999.99),
});

export const budgetSchema = z.object({
  budget: z.coerce.number().nonnegative().finite().max(9999999999.99),
});
