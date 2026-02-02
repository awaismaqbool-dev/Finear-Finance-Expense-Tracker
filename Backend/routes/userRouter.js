import express from "express";

import { userDashboard } from "../controllers/userController.js";
import { addTransaction, deleteTransaction } from "../controllers/transactionController.js";
import authMiddelWear from "../middelWare/authMiddelWear.js";
import { addMoneyToGoal, createGoal } from "../controllers/goalController.js";



const userRouter= express.Router();
// 1. Get User Profile & Balances
 userRouter.get("/",authMiddelWear, userDashboard ) ;
 // 2. Add New Transaction
 userRouter.post("/add-transaction", authMiddelWear, addTransaction);
 // 3. Delete Transaction (By ID)
userRouter.delete("/delete-transaction", authMiddelWear, deleteTransaction);
//4.create goal saving 
userRouter.post("/create-goal", authMiddelWear, createGoal);
// 5. add money to goal 
userRouter.post("/goal-transaction", authMiddelWear, addMoneyToGoal);


 export default userRouter;
