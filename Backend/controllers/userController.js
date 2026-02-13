import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";
import userModel from "../userModels/authModel.js";
import goalsModel from "../userModels/goalsModel.js";


export const userProfilePic = async (req, res) => {
  const userId = req.userId || req.body.id;
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image Uploading error" });
    }
    // Database mein naya path save karo
        // Yaad rakho: sirf file ka naam save karna behtar hai
        const user = await userModel.findByIdAndUpdate(
            userId,
            { image: req.file.filename }, 
            { new: true }
        );
        res.json({ 
            success: true, 
            message: "Profile image updated!", 
            image: req.file.filename 
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const loadProfile = async (req, res)=>{
  try {
    // Check karo ke middleware ne ID bheji hai ya nahi
  const userId = req.userId || req.body.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "No User ID found in token" });
  }
    const user = await userModel.findById(userId);
    if (!user){ return res.json({ success: false, message: "User not found" })};
    res.json({
      success: true,
      userData:{
        name:user.name,
        email:user.email,
        profilePic:`${process.env.BASE_URL}/uploadImages/${user.image}`,
        verified:user.isVerified
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }

}
export const updateBudget = async (req, res) => {
  const { budget } = req.body;
  await profileModel.findOneAndUpdate({ userId: req.userId }, { monthlyBudget: budget });
  res.json({ success: true });
};
export const userDashboard = async (req, res) => {
  try {
    const userId = req.userId || req.body.id;

    // 1. Profile Data (Balances)
    const user = await profileModel.findOne({ userId });
    if (!user) return res.json({ success: false, message: "User not found" });
    //2. All Transactions for Calculation (Income/Expense)
    const allTransactions = await TransactionModel.find({ userId });
    let totalIncome = 0;
    let totalExpense = 0;
    allTransactions.forEach(trans => {
      if (trans.type === 'income') {
        totalIncome += trans.amount;
      } else if (trans.type === 'expense') {
        totalExpense += trans.amount;
      }
    });

    // 2. Recent Transactions (Latest 5)
    // .sort({ createdAt: -1 }) se nayi transactions upar aayengi
    const recentTransactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Active Goals (Jo abhi complete nahi huye)
    const activeGoals = await goalsModel
      .find({ userId, status: "Active" })
      .limit(4);

    // Final Response Combined
    res.json({
      success: true,
      userData: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance,
        totalBalance: user.handBalance + user.bankBalance,
        savings: user.flexibleSavings,
        income: totalIncome,
        expense: totalExpense,
        monthlyBudget:user.monthlyBudget,
      },
      recentTransactions,
      activeGoals,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
