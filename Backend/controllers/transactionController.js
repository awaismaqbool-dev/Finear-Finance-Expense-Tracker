
import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";

export const addTransaction = async (req, res) => {
    
    try {
      const userId = req.userId || req.body.id;
        const {title, amount, type, source, category } = req.body;
        //const user = await profileModel.findById({userId:userId});
const user = await profileModel.findOne({userId:userId});
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    // 2. Logic Check: Agar Expense hai toh balance check 
    if (type === "expense" || type==="savings") {
      const currentBalance = source === "cash" ? user.handBalance : user.bankBalance;
      if (currentBalance < amount) {
        return res.status(400).json({ 
          message: `Incomplete Funds! Your ${source} is insufficient` 
        });
      }
    }
    // 3. Transaction Create Karo
    const newTransaction = new TransactionModel({
     userId,
      title,
      amount,
      type,
      source,
      category,
    })
    await newTransaction.save();
    // 4. User Balance Update Karo (Atomic Logic)
    if (type === "income") {
      if (source === "cash") user.handBalance += amount;
      else user.bankBalance += amount;
    } 
    else if (type === "expense") {
      if (source === "cash") user.handBalance -= amount;
      else user.bankBalance -= amount;
    }
    else if (type === "savings") {
      // Savings logic: Bank/Cash se nikal kar Savings mein jaay
      if (source === "cash") user.handBalance -= amount;
      else user.bankBalance -= amount;
      user.flexibleSavings = (user.flexibleSavings || 0) + amount;
    }
    await user.save();
    res.status(201).json({
      message: "Transaction successful!",
      transaction: newTransaction,
      updatedBalance: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance,
        flexibleSavings: user.flexibleSavings
      }
    });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteTransaction= async(req,res)=>{
    try {
        const { id } = req.params; // Transaction ID
        const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Fonud!" });
    }
const user = await profileModel.findById(transaction.userId);
if (!user) return res.status(404).json({ message: "User Not Fonud!" });
// --- REVERT BALANCE LOGIC ---
    // Agar Income delete kar rahe hain, toh balance kam hoga
    // Agar Expense delete kar rahe hain, toh balance wapas badh jayega
    const amount = transaction.amount;
    const isIncome = transaction.type === "income";
    const isExpense = transaction.type === "expense";
    const isSavings = transaction.type === "savings";
    if (transaction.source === "cash") {
      if (isIncome) user.handBalance -= amount;
      if (isExpense) user.handBalance += amount;
      if (isSavings) {
          user.handBalance += amount;
          user.flexibleSavings -= amount;
      }
    } else {
      if (isIncome) user.bankBalance -= amount;
      if (isExpense) user.bankBalance += amount;
      if (isSavings) {
          user.bankBalance += amount;
          user.flexibleSavings -= amount;
      }
    }
    await user.save();
    await TransactionModel.findByIdAndDelete(id);
    res.status(200).json({ 
      message: "Transaction deleted and balance adjusted!",
      updatedBalance: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance
      }
    });
    } catch (error) {
res.status(500).json({ message: "Error! in Deleting record", error: error.message });
    }
}
