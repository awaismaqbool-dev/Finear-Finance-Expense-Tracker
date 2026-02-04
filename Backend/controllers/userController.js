import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";
import userModel from "../userModels/authModel.js";
import goalsModel from "../userModels/GoalsModel.js";

export const userProfile = async (req, res) => {
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
export const userDashboard = async (req, res) => {
  try {
    const userId = req.userId || req.body.id;

    // 1. Profile Data (Balances)
    const user = await profileModel.findOne({ userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    // 2. Recent Transactions (Latest 5)
    // .sort({ createdAt: -1 }) se nayi transactions upar aayengi
    const recentTransactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Active Goals (Jo abhi complete nahi huye)
    const activeGoals = await goalsModel
      .find({ userId, status: "Active" })
      .limit(3);

    // Final Response Combined
    res.json({
      success: true,
      userData: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance,
        totalBalance: user.handBalance + user.bankBalance,
        savings: user.flexibleSavings,
      },
      recentTransactions,
      activeGoals,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
