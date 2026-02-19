import React, { useEffect } from "react";
import { X, ArrowDownCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import API from "../../../api";

const AddMoneyGoal = ({ isOpen, onClose,onSuccess,selectedGoal=null }) => {
  if (!isOpen) return null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "Bank"
  });
useEffect(()=>{
  if (selectedGoal && isOpen) {
    setFormData({
          amount: selectedGoal.amount ||"",
    source: selectedGoal.source
    })
  }else if(isOpen){
    setFormData({amount:"",source:"Bank"})
  }
},[selectedGoal,isOpen])
if (!isOpen) return null;

 const AddMoneyinGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payLoad = {
        goalId: selectedGoal?._id, // Backend ko ID chahiye
        amount: Number(formData.amount),
        source:formData.source.toLowerCase()  // Convert to lowercase 
      };
      console.log("Sending Goal money to API:", payLoad);
      const response = await API.post("/dashboard/goal-transaction", payLoad);  
      if (response.data.success || response.status === 200) {
        alert(response.data.message);
        setFormData({ amount: "", source: "bank" });
        if (onSuccess) onSuccess(); // List refresh karne ke liye
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-back-ground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <span className="ml-3 text-primary font-medium">Loading Finear...</span>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 md:p-10 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1D265C] font-dmsans tracking-tight">
            Add Funds to Goal
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:opacity-70 transition-opacity"
          >
            <X size={48} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={AddMoneyinGoal}
        >
          {/* Amount Field */}
          <div className="space-y-4">
            <label className="text-xl md:text-lg font-bold text-[#1D265C] ml-1">
              Amout
            </label>
            <input
              type="number"
              value={formData.amount} // State se connect kiya
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Enter withdrawal amount"
              className="w-full bg-[#E5EFF9] border-none rounded-2xl p-4 text-xl focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Transfer Destination Selector */}

          <div className="space-y-3">
            <label className="text-primary font-bold ml-1">
              Where Do You Transfer:
            </label>
            <div className="flex gap-4 ml-1 mt-5">
              {["bank", "cash"].map((target) => (
                <label
                  key={target}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="source"
                    value={target}
                    checked={formData.source === target} // Dynamic check
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-4 h-4 accent-secondary cursor-pointer"
                  />
                  <span className="text-primary font-bold text-lg group-hover:text-secondary transition-colors">
                    {target.charAt(0).toUpperCase() + target.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6">
            <button
              className="flex items-center gap-3 bg-bule-gradient text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
              disabled={loading}
              type="submit"
            >
              <PlusCircle size={24} /> Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyGoal;