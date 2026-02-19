import React from 'react';
import { X } from 'lucide-react';
import { useState } from "react";
import API from "../../../api";

const DeleteGoalPopup = ({ isOpen, onClose, selectedGoal, onSuccess }) => {
    const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

    const deleteGoal=async()=>{
      if (!selectedGoal?._id) return;
      try {
  const response= await API.delete("/dashboard/delete-goal",{
    data: { goalId: selectedGoal._id }
  });
  
  if(response.data.success ||response.status === 200){
  alert(response?.data?.message)
  onSuccess();
      onClose();
  }
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }finally {
      setLoading(false);
    }
    }
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
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 md:p-16 animate-in zoom-in duration-300">
        
        {/* Header with Close Button */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D265C] font-dmsans">
            Delete Goal
          </h2>
          <button 
            onClick={onClose} 
            className="text-black hover:opacity-70 transition-opacity mt-2"
          >
            <X size={48} strokeWidth={1.5} />
          </button>
        </div>

        {/* Message */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-black font-medium font-dmsans leading-relaxed">
            Are You Sure You Want To Delete This Goal? 
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            onClick={()=>{deleteGoal()}}
            disabled={loading}
            className="bg-bule-gradient text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all min-w-45"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalPopup;