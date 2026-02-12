import React from 'react';
import { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import API from "../../../api";


const TransactionPopup = ({ isOpen, onClose,type, name, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    source: "Bank", // Default
    category: "",
  });
  if (!isOpen) return null;
  const handleSubmit = async(e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const payLoad = {
      ...formData,
      type,
      source: formData.source.toLowerCase()  // Convert to lowercase 
    }
    console.log("Sending to API:", payLoad);
    const response = await API.post("/dashboard/add-transaction", payLoad);
    if(response.data.success || response.status === 201) {
      alert(`${type} add successfully!`)
      setFormData({ title: "", amount: "", source: "Bank", category: "" });
      onSuccess();
      onClose();
    }
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}
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
          <h2 className="text-3xl font-bold text-primary">Add {name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Fields */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Income Title */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">{name} Title</label>
            <input 
            required
              type="text" 
              value={formData.title}
              placeholder="e.g transaction name"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Amount</label>
            <input 
              required
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Enter amount"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Source Selector (Bank / Cash) */}
          <div className="space-y-3">
            <label className="text-primary font-bold ml-1">Source</label>
            <div className="flex gap-8 ml-1">
              {["Bank", "Cash"].map((mode) => (
                <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="source" 
                    value={mode}
                    checked={formData.source === mode}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-5 h-5 accent-secondary cursor-pointer" 
                  />
                  <span className="text-primary font-bold group-hover:text-secondary transition-colors">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-primary font-bold ml-1">Category</label>
            <input 
              required
              type="text" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g. Food, Salary, Rent"
              className="w-full bg-[#E5EFF9] border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 bg-bule-gradient to-light-bule text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
            disabled={loading}
            type="submit">
              <PlusCircle size={20} /> Add {name}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionPopup;