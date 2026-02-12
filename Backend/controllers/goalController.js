import goalsModel from "../userModels/GoalsModel.js";
import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";

export const createGoal = async (req, res) => {
  
    const userId = req.userId
  const { goalName, targetAmount, priority } = req.body;
  try {
    const newGoal = new goalsModel({
      userId,
      goalName,
      targetAmount,
      priority, // High, Medium, Low
      savedAmount: 0,
    });
    await newGoal.save();
   return res.status(201).json({ 
            success: true, 
            message: "Goal Added Successfully" 
        });
  } catch (error) {
    console.error("DB SAVE ERROR:", error.message); // Terminal mein error dekhein
        return res.status(500).json({ 
            success: false, 
            message: "Database error: " + error.message 
        });
  }
};
export const addMoneyToGoal = async (req, res) => {
  const userId = req.userId || req.body.id;
  const { goalId, amount, source } = req.body;

  try {
    const profile = await profileModel.findOne({ userId });

    // Fix: user.bankBalance ki jagah string fields use karo
    const balanceField = source === "Bank" ? "bankBalance" : "handBalance";

    // Check if profile exists first (Safety check)
    if (!profile)
      return res.json({ success: false, message: "Profile not found!" });

    if (profile[balanceField] < amount) {
      return res.json({
        success: false,
        message: `Insufficient ${source} balance!`,
      });
    }

    const goal = await goalsModel.findOne({ _id: goalId, userId: userId });

    if (!goal) {
      return res.json({ success: false, message: "Goal not found!" });
    }

    // Logic
    const totalNewAmount=goal.savedAmount += Number(amount);
    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "Completed";
    }
    if (goal.savedAmount >= goal.targetAmount) {
      return res.json({
        success: false,
        message:
          "Goal Has Alreday Complete!",
      });
    }

    if (totalNewAmount > goal.targetAmount) {
      const remainingNeeded = goal.targetAmount - goal.savedAmount;
      return res.json({
        success: false,
        message: `Your need ${remainingNeeded} PKR only for achive your goal  `,
      });
    }
    await goal.save();

    // Profile Balance Update - Using the correct profile variable
    profile[balanceField] -= Number(amount);
    await profile.save();

    // Transaction Record
    const newTx = new TransactionModel({
      userId,
      title: `Saved for ${goal.goalName}`,
      amount,
      type: "savings",
      source,
      category: "Goal",
    });
    await newTx.save();

    res.json({
      success: true,
      message: `Successfully added ${amount} to ${goal.goalName}!`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/goals/delete
export const deleteGoal = async (req, res) => {
    const { goalId } = req.body;
    const userId = req.userId || req.body.id;

    try {
        // 1. Goal finding
        const goal = await goalsModel.findOne({ _id: goalId, userId });

        if (!goal) return res.status(404).json({ success: false, message: "goal not fond" });

        const amountToRefund = goal.savedAmount;

        // 2. Agar kuch paisa jama tha to Flexible Savings) mein jay ga 
        if (amountToRefund > 0) {
            await profileModel.findOneAndUpdate(
                { userId },
                { $inc: { flexibleSavings: amountToRefund } }
            );

            // Ek transaction record taake history bani rahe
            await TransactionModel.create({
                userId,
                title: `Refund: ${goal.goalName} deleted`,
                amount: amountToRefund,
                type: "savings", // System isey wapas as an internal income treat karega
                source: "cash", // Default as flexible asset
                category: "Goal Refund"
            });
        }

        // 3. Goal delete kar do
        await goalsModel.findByIdAndDelete(goalId);

        res.status(200).json({ 
            success: true, 
            message: `Goal delete ho gaya aur ${amountToRefund} PKR Gullak mein transfer kar diye gaye.` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
//edit Goal Name/Target
export const updateGoal = async (req, res) => {
    const { goalId, goalName, targetAmount, priority } = req.body;
    const userId = req.userId || req.body.id;

    try {
        const updatedGoal = await goalsModel.findOneAndUpdate(
            { _id: goalId, userId }, 
            { goalName, targetAmount, priority }, 
            { new: true } // Taake updated data wapas milay
        );

        if (!updatedGoal) return res.status(404).json({ success: false, message: "Goal not fonud" });

        res.json({ success: true, data: updatedGoal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getGoals = async (req, res) => {
try {
    const userId = req.userId;
    const goal = await goalsModel.find({userId}).sort({ createdAt: -1 })
     if (!goal || goal.length === 0) {
            return res.status(200).json({ success: true, goals: [], message: "No goals found"});
        }
res.json({
      success: true,
      goal// Charts ke liye
    });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
}