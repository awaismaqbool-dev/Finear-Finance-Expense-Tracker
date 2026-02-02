import mongoose from "mongoose";

const goalsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true,
  },
  goalName: { 
    type: String, 
    required: [true, "Goal name is required"], 
    trim: true 
  },
  targetAmount: { 
    type: Number, 
    required: true,
    min: [1, "Target amount must be greater than 0"] // Logic check!
  },
  savedAmount: { 
    type: Number, 
    default: 0 
  },
  priority: { 
    type: String, 
    enum: ["high", "medium", "low"], 
    required: true
  },
  status: { 
    type: String, 
    enum: ["Active", "Completed"], 
    default: "Active" // Naya goal hamesha active hoga
  },
}, { timestamps: true }); // Taake pata chale goal kab banaya tha

const goalsModel = mongoose.model("goals", goalsSchema);
export default goalsModel;