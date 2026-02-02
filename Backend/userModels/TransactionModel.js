import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["income", "expense", "savings"],
    required:true
  },
  source: { type: String, enum: ["cash", "bank"], required:true},
  category: { type: String, default: "general" },
  date: {
    type: Date,
    default: Date.now,
  }
});
const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;
