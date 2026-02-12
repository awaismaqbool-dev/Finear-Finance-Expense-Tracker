import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import API from "../../../api";

// 1. onSuccess prop yahan lazmi add karein
const AddGoalPopUp = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    priority: "medium", 
  });
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Data types ensure karein
      const payLoad = {
        goalName: formData.goalName, // Agar backend 'title' mang raha hai
        targetAmount: Number(formData.targetAmount),
        priority: formData.priority.toLowerCase()  // Convert to lowercase 
      };
      console.log("Sending Goal to API:", payLoad);
      const response = await API.post("/dashboard/create-goal", payLoad);
      if (response.data.success || response.status === 201) {
        alert("Goal added successfully!");
        setFormData({ goalName: "", targetAmount: "", priority: "medium" });
        if (onSuccess) onSuccess(); // List refresh karne ke liye
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Add New Goal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Goal Name */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Goal Name</label>
            <input 
              required
              type="text" 
              value={formData.goalName} // State se connect kiya
              onChange={(e) => setFormData({...formData, goalName: e.target.value})}
              placeholder="e.g. Buy IPhone 13"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Target Amount (PKR)</label>
            <input 
              required
              type="number" 
              value={formData.targetAmount} // State se connect kiya
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              placeholder="e.g. 200000"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className="text-primary font-bold ml-1">Priority Level</label>
            <div className="flex gap-4 ml-1">
              {['High', 'Medium', 'Low'].map((prio) => (
                <label key={prio} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="priority" 
                    value={prio} 
                    checked={formData.priority === prio} // Dynamic check
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-4 h-4 accent-secondary cursor-pointer" 
                  />
                  <span className="text-primary font-bold text-sm group-hover:text-secondary transition-colors">{prio}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              disabled={loading}
              type='submit'
              className="flex items-center gap-2 bg-bule-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Target size={20} /> {loading ? "Saving..." : "Set Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalPopUp;