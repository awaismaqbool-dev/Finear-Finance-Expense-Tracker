export type TransactionType = "income" | "expense" | "savings";
export type MoneySource = "cash" | "bank";
export type GoalPriority = "high" | "medium" | "low";
export type GoalStatus = "Active" | "Completed";

export interface TransactionRecord {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  source: MoneySource;
  category: string;
  createdAt: string;
}

export interface GoalRecord {
  id: string;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  priority: GoalPriority;
  status: GoalStatus;
  createdAt: string;
}

export interface ProfileSummary {
  name: string;
  email: string;
  imagePath: string;
  handBalance: number;
  bankBalance: number;
  totalBalance: number;
  flexibleSavings: number;
  monthlyBudget: number;
  currency: "PKR";
}

export interface DashboardData {
  profile: ProfileSummary;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: TransactionRecord[];
  activeGoals: GoalRecord[];
}
