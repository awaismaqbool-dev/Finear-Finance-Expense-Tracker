import React from 'react';
import { Plus, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';
import TransactionPopup from '../../components/popups/transactionPopup';

const Income = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  // Dummy data for the Chart
  const chartData = [
    { date: '1st Jan', amount: 180 },
    { date: '18 Jan', amount: 450 },
    { date: '18 Jan', amount: 520 },
    { date: '31 Jan', amount: 200 },
    { date: '3rd Feb', amount: 450 },
    { date: '10 Feb', amount: 520 },
    { date: '13 Feb', amount: 180 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Income Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Income Overview</h2>
            <p className="text-gray-400 text-sm">Track your earnings over time and analyze your income trends.</p>
          </div>
<button 
  onClick={() => setIsPopUpOpen(true)}
  className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 cursor-pointer"
>
  <Plus size={18} /> Add Income
</button>
        </div>

        {/* Bar Chart Container */}
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="amount" fill="#0055ff" radius={[15, 15, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Income Sources Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary">Income Sources</h2>
          <button className="flex items-center gap-2 bg-back-ground px-4 py-2 rounded-xl text-xs font-bold text-primary border border-gray-100 hover:bg-gray-100 transition-all cursor-pointer">
            Download <Download size={14} />
          </button>
        </div>

        {/* Transactions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-primary/80 group-hover:scale-110 transition-transform"></div>
                <div>
                  <p className="font-bold text-primary">Shopping</p>
                  <p className="text-[10px] text-gray-400 font-medium">17 feb 2025</p>
                </div>
              </div>
              <div className="bg-back-ground px-4 py-2 rounded-2xl text-xs font-bold text-primary">
                -250 PKR
              </div>
            </div>
          ))}
        </div>
      </div>
      <TransactionPopup isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)} />
    </div>
  );
};

export default Income;