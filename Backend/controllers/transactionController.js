import profileModel from "../userModels/profileModel.js";
import TransactionModel from "../userModels/TransactionModel.js";
import ExcelJS from "exceljs";

export const addTransaction = async (req, res) => {
  try {
    const userId = req.userId || req.body.id;
    const { title, amount, type, source, category } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required. Please login first." });
    }

    //const user = await profileModel.findById({userId:userId});
    const user = await profileModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not Found",
        searchedUserId: userId,
        tip: "Make sure you're logged in and have created a profile",
      });
    }
    // 2. Logic Check: Agar Expense hai toh balance check
    if (type === "expense" || type === "savings") {
      const currentBalance =
        source === "cash" ? user.handBalance : user.bankBalance;
      if (currentBalance < amount) {
        return res.status(400).json({
          message: `Incomplete Funds! Your ${source} is insufficient`,
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
    });
    await newTransaction.save();
    // 4. User Balance Update Karo (Atomic Logic)
    const numAmount = Number(amount);
    if (type === "income") {
      if (source === "cash") user.handBalance += numAmount;
      else user.bankBalance += numAmount;
    } else if (type === "expense") {
      if (source === "cash") user.handBalance -= numAmount;
      else user.bankBalance -= numAmount;
    } else if (type === "savings") {
      // Savings logic: Bank/Cash se nikal kar Savings mein jaay
      if (source === "cash") user.handBalance -= numAmount;
      else user.bankBalance -= numAmount;
      user.flexibleSavings = (Number(user.flexibleSavings) || 0) + numAmount;
    }
    await user.save();
    res.status(201).json({
      message: "Transaction successful!",
      transaction: newTransaction,
      updatedBalance: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance,
        flexibleSavings: user.flexibleSavings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const userId = req.userId || req.body.id;
  const { transactionId } = req.body;
  try {
    const transaction = await TransactionModel.findOne({
      _id: transactionId,
      userId,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Fonud!" });
    }
    const user = await profileModel.findOne({ userId: transaction.userId });
    if (!user) return res.status(404).json({ message: "User Not Fonud!" });
    // --- REVERT BALANCE LOGIC ---
    // Agar Income delete kar rahe hain, toh balance kam hoga
    // Agar Expense delete kar rahe hain, toh balance wapas badh jayega
    const amount = Number(transaction.amount);
    const type = transaction.type.toLowerCase();
    const source = transaction.source.toLowerCase();
    if (source === "cash") {
      if (type === "income") {
        user.handBalance -= amount;
      } else if (type === "expense") {
        user.handBalance += amount;
      } else if (type === "savings") {
        user.handBalance += amount;
        user.flexibleSavings -= amount;
      }
    } else if (source === "bank") {
      if (type === "income") {
        user.bankBalance -= amount;
      } else if (type === "expense") {
        user.bankBalance += amount;
      } else if (type === "savings") {
        user.bankBalance += amount;
        user.flexibleSavings -= amount;
      }
    }
    await user.save();
    await TransactionModel.findOneAndDelete({
      _id: transactionId,
      userId: userId,
    });
    res.status(200).json({
      message: "Transaction deleted and balance adjusted!",
      updatedBalance: {
        handBalance: user.handBalance,
        bankBalance: user.bankBalance,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error! in Deleting record", error: error.message });
  }
};
// POST /api/profile/withdraw-savings
//edit transaction Name/Target
export const updateTrasnaction = async (req, res) => {
    const userId = req.userId || req.body.id;
    const { transactionId, title, category, amount, source, type } = req.body;

    try {
        // 1. Pehle purani transaction dhondi
        const transaction = await TransactionModel.findOne({ _id: transactionId, userId });
        if (!transaction) return res.status(404).json({ message: "Transaction Not Found!" });

        const user = await profileModel.findOne({ userId: transaction.userId });
        if (!user) return res.status(404).json({ message: "User Not Found!" });

        // --- STEP A: PURANI TRANSACTION ko REVERT
        const oldAmount = Number(transaction.amount);
        const oldType = transaction.type.toLowerCase();
        const oldSource = transaction.source.toLowerCase();

        if (oldSource === "cash") {
            if (oldType === "income") user.handBalance -= oldAmount;
            else if (oldType === "expense" || oldType === "savings") user.handBalance += oldAmount;
            if (oldType === "savings") user.flexibleSavings -= oldAmount;
        } else {
            if (oldType === "income") user.bankBalance -= oldAmount;
            else if (oldType === "expense" || oldType === "savings") user.bankBalance += oldAmount;
            if (oldType === "savings") user.flexibleSavings -= oldAmount;
        }

        // --- STEP B: BALANCE CHECK FOR NEW TRANSACTION ---
        const newAmount = Number(amount);
        const newType = type ? type.toLowerCase() : oldType; // Type ab send ho sakta hai
        const newSource = source.toLowerCase();

        if (newType === "expense" || newType === "savings") {
            const currentBalance = newSource === "cash" ? user.handBalance : user.bankBalance;
            if (currentBalance < newAmount) {
                return res.status(400).json({ 
                    message: `Incomplete Funds! Your ${newSource} balance is insufficient. Available: ${currentBalance}, Required: ${newAmount}` 
                });
            }
        }

        // --- STEP C: APPLY NEW TRANSACTION ---
        if (newSource === "cash") {
            if (newType === "income") user.handBalance += newAmount;
            else if (newType === "expense" || newType === "savings") user.handBalance -= newAmount;
            if (newType === "savings") user.flexibleSavings += newAmount;
        } else {
            if (newType === "income") user.bankBalance += newAmount;
            else if (newType === "expense" || newType === "savings") user.bankBalance -= newAmount;
            if (newType === "savings") user.flexibleSavings += newAmount;
        }

        // --- STEP D: DATABASE UPDATE ---
        transaction.title = title;
        transaction.amount = newAmount;
        transaction.source = newSource;
        transaction.category = category;
        if (type) transaction.type = type; // Type update karo agar bheja gaya ho

        await user.save();
        await transaction.save();

        res.json({ 
            success: true, 
            message: "Updated and Balance Adjusted!", 
            data: transaction,
            updatedBalance: {
                handBalance: user.handBalance,
                bankBalance: user.bankBalance,
                flexibleSavings: user.flexibleSavings
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const withdrawSavings = async (req, res) => {
  const { amount, targetSource } = req.body; // targetSource: 'Cash' or 'Bank'
  const userId = req.userId || req.body.id;

  try {
    const profile = await profileModel.findOne({ userId });

    // 1. Check karo savings mein itna paisa hai bhi ya nahi
    if (profile.flexibleSavings < amount) {
      return res
        .status(400)
        .json({ success: false, message: "savings has not enough money" });
    }

    // 2. savings se minus karo aur Target (Hand/Bank) mein plus karo
    const balanceField =
      targetSource === "Bank" ? "bankBalance" : "handBalance";

    profile.flexibleSavings -= Number(amount);
    profile[balanceField] += Number(amount);

    await profile.save();

    // 3. Transaction record (Withdrawal)
    await TransactionModel.create({
      userId,
      title: "Withdrawn from savings",
      amount,
      type: "income", // Balance barh raha hai isliye income type
      source: targetSource,
      category: "Savings Withdraw",
    });

    res.status(200).json({
      success: true,
      message: `${amount} PKR Gullak se nikaal kar aapke ${targetSource} balance mein daal diye gaye hain.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const exportTransactionsToExcel = async (req, res) => {
  try {
    const userId = req.userId;
    // Frontend se 'type' ayega (income, expense, ya savings)
    const { type } = req.query;

    let filter = { userId };

    // Agar type valid hai, toh filter mein add karo
    if (type && ["income", "expense", "savings"].includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }

    const transactions = await TransactionModel.find(filter).sort({
      createdAt: -1,
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "FIle not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Columns setup
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Title", key: "title", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Type", key: "type", width: 12 },
      { header: "Category", key: "category", width: 18 },
    ];

    // Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Light Grey Header
    };

    transactions.forEach((tx) => {
      worksheet.addRow({
        date: new Date(tx.createdAt).toLocaleDateString(),
        title: tx.title,
        amount: tx.amount,
        type: tx.type.toUpperCase(),
        category: tx.category,
      });
    });

    // Dynamic File Name
    const fileLabel = type
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : "All";
    const fileName = `Finear_${fileLabel}_Report.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
