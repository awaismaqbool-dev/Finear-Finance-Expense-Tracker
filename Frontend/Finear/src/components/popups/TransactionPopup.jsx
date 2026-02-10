import React from 'react';
import { X, PlusCircle } from 'lucide-react';

const TransactionPopup = ({ isOpen, onClose }) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Add Income</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Fields */}
        <form className="space-y-6">
          {/* Income Title */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Income Title</label>
            <input 
              type="text" 
              placeholder="e.g. Monthly Salary"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Amount</label>
            <input 
              type="number" 
              placeholder="Enter amount"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Source Selector (Bank / Cash) */}
          <div className="space-y-3">
            <label className="text-primary font-bold ml-1">Source</label>
            <div className="flex gap-8 ml-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="source" className="w-5 h-5 accent-secondary cursor-pointer" defaultChecked />
                <span className="text-primary font-bold group-hover:text-secondary transition-colors">Bank</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="source" className="w-5 h-5 accent-secondary cursor-pointer" />
                <span className="text-primary font-bold group-hover:text-secondary transition-colors">Cash</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Salary, Freelance"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-10 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 bg-bule-gradient to-light-bule text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
              <PlusCircle size={20} /> Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionPopup;