import userModel from "../userModels/authModel.js";
import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";

export const getTransactions = async (req, res) => {
try {
    const userId = req.userId;
    const { type } = req.query;

    const filter = {userId}
    if (type) {
      filter.type = type; // e.g., 'Income' ya 'Expense'
    }
    const transactions = await TransactionModel.find(filter).sort({ createdAt: -1 });
    // 3. Graph Data ready karo (Category wise grouping)
    const graphData = transactions.reduce((acc, curr) => {
      const category = curr.category || "Other";
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += curr.amount;
        } else {
        acc.push({ name: category, value: curr.amount });
      }
      return acc;
    }, [])
    res.json({
      success: true,
      count: transactions.length,
      transactions, // List ke liye
      graphData     // Charts ke liye
    });
} catch (error) {
  res.json({ success: false, message: error.message });
}
}