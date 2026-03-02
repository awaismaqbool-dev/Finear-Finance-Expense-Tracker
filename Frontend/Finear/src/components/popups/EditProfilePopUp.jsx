import React, { useEffect, useState } from 'react';
import { X, Target } from 'lucide-react';
import API from "../../../api";

// 1. onSuccess prop yahan lazmi add karein
const EditProfilePopUp = ({ isOpen, onClose,initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    priority: "medium", 
  });
  useEffect(()=>{
    if (initialData && isOpen) {
      setFormData({
        goalName: initialData.goalName||"",
    targetAmount: initialData.targetAmount||"",
    priority: initialData.priority,
      })
    }else if(isOpen){
      setFormData({ goalNamee: "", targetAmount: "", priority: "medium"});
    }
  },[initialData, isOpen])
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payLoad = {
        goalName: formData.goalName, // Agar backend 'title' mang raha hai
        targetAmount: Number(formData.targetAmount),
        priority: formData.priority.toLowerCase()  // Convert to lowercase 
      };
      console.log("Sending Goal to API:", payLoad);
      let response; 
      if (initialData) {
        response = await API.put("/dashboard/update-goal", {
          ...payLoad,
          goalId: initialData._id // ID bheji hai
        });
      }else {
        response = await API.post("/dashboard/create-goal", payLoad);
      }
      if (response.data.success || response.status === 201 || response.status === 200) {
        alert(initialData ? "Updated Successfully!" : "Goal added successfully!")
        setFormData({ goalName: "", targetAmount: "", priority: "medium" });
         // List refresh karne ke liye onSuccess();
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
          <div className="flex justify-end pt-4">
            <button 
              disabled={loading}
              type='submit'
              className="flex items-center gap-2 bg-bule-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
                Change Name 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopUp;