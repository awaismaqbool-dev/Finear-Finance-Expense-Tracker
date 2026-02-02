import profileModel from "../userModels/profileModel.js";


export const userDashboard = async (req,res)=>{
    try {
        const userId = req.userId || req.body.id;
        const user = await profileModel.findOne({userId:userId});

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Ab hum sirf naam nahi, balki balances bhi bhejenge
        res.json({
            success: true,
            userData: {
                // Dashboard Cards ke liye ye zaroori hai:
                handBalance: user.handBalance,
                bankBalance: user.bankBalance,
                totalBalance: user.handBalance + user.bankBalance, // Total calculation
                savings: user.flexibleSavings
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}