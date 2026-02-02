import mongoose from "mongoose";

const profileSchema= mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    handBalance: { type: Number, default:0},
    bankBalance: { type: Number, default:0},
    flexibleSavings:{type: Number , default: 0},
    monthlyBudget:{type: Number , default: 0},
    currency: { type: String, default: "PKR"},   
},{
timestamps: true 
}
);
const profileModel = mongoose.model('profile', profileSchema);
export default profileModel;

