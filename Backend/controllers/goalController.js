import goalsModel from "../userModels/GoalsModel.js";
import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";

export const createGoal = async (req, res) => {
  const userId = req.userId || req.body.id;
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
    res.json({
      success: true,
      message: "Goal setup Successfully! now you can add money ",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
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

// export const addMoneyToGoal = async (req, res) => {
//     const userId = req.userId || req.body.id;
//     // 1. Frontend se goalId lazmi mangwao
//     const { goalId, amount, source } = req.body;

//     try {
//         const profile = await profileModel.findOne({ userId });
//         const balanceField = source === 'Bank' ? user.bankBalance:user.handBalance;

//         if (profile[balanceField] < amount) {
//             return res.json({ success: false, message: `Insufficient ${source} balance!` });
//         }

//         // 2. Ab userId ke bajaye specific goalId se find karo
//         const goal = await goalsModel.findOne({ _id: goalId, userId: userId });

//         if (!goal) {
//             return res.json({ success: false, message: "Goal not found!" });
//         }

//         // 3. Calculation (Number ka 'N' capital rakho ya parsefloat use karo)
//         goal.savedAmount += Number(amount);

//         if (goal.savedAmount >= goal.targetAmount) {
//             goal.status = "Completed";
//         }
//         await goal.save();

//         // 4. Profile Balance Update (Ye step tumhare code mein miss tha)
//         profile[balanceField] -= Number(amount);
//         await profile.save();

//         // 5. Transaction Record
//         const newTx = new TransactionModel({
//             userId,
//             title: `Saved for ${goal.goalName}`,
//             amount,
//             type: "savings",
//             source,
//             category: "Goal"
//         });
//         await newTx.save();

//         res.json({ success: true, message: "Money saved for Goal!" });

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }
