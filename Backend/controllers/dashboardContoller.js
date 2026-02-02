import userModel from "../userModels/authModel";
import profileModel from "../userModels/profileModel";
import TransactionModel from "../userModels/TransactionModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await TransactionModel.find({ userId });

    const stats = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.totalIncome += curr.amount;
      if (curr.type === 'expense') acc.totalExpense += curr.amount;
      if (curr.type === 'savings') acc.totalSavings += curr.amount;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalSavings: 0 });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Stats nikaalne mein masla hai." });
  }
};