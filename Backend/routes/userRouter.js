import express from "express";

import { loadProfile, updateBudget, userDashboard, userProfilePic } from "../controllers/userController.js";
import { addTransaction, deleteTransaction, exportTransactionsToExcel, updateTrasnaction } from "../controllers/transactionController.js";
import authMiddelWear from "../middelWare/authMiddelWear.js";
import { addMoneyToGoal, createGoal, deleteGoal, getGoals, updateGoal } from "../controllers/goalController.js";
import { upload } from "../config/multer.js";
import { getTransactions } from "../controllers/GetTransactions.js";



const userRouter= express.Router();
// 1. Get User dashbaord & Balances
 userRouter.get("/",authMiddelWear, userDashboard ) ;
 //1.1 when user open dash baord first pofile load 
 userRouter.get("/loadprofile",authMiddelWear, loadProfile ) ;
 // 2. Add New Transaction
 userRouter.post("/add-transaction", authMiddelWear, addTransaction);
 // 3. Delete Transaction (By ID)
userRouter.delete("/delete-transaction", authMiddelWear, deleteTransaction);
//4.create goal saving 
userRouter.post("/create-goal", authMiddelWear, createGoal);
// 5. add money to goal 
userRouter.post("/goal-transaction", authMiddelWear, addMoneyToGoal);
//6. profile chnaging 
userRouter.post('/update-image', authMiddelWear, upload.single('image'), userProfilePic);
 // 7. Delete Transaction (By ID)
userRouter.delete("/delete-goal", authMiddelWear, deleteGoal);
 // 7. Delete Transaction (By ID)
userRouter.get("/export-sheet", authMiddelWear, exportTransactionsToExcel);
//8./updateBudget 
userRouter.post('/updateBudget', authMiddelWear, updateBudget);
//9. get transactions for pages
userRouter.get('/get-transactions', authMiddelWear, getTransactions)
//10 get goal for display goal on ssaving page 
userRouter.get('/get-goals', authMiddelWear, getGoals)

userRouter.put('/update-transaction',authMiddelWear,updateTrasnaction )



 export default userRouter;
