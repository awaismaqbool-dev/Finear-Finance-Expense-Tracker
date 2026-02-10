import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data for Expense Wave Chart
  const expenseData = [
    { date: '1st Jan', amount: 500 },
    { date: '18 Jan', amount: 450 },
    { date: '18 Jan', amount: 180 },
    { date: '31 Jan', amount: 680 },
    { date: '3rd Feb', amount: 320 },
    { date: '10 Feb', amount: 480 },
    { date: '13 Feb', amount: 280 },
    { date: '20 Feb', amount: 680 },
    { date: '25 Feb', amount: 420 },
    { date: '28 Feb', amount: 550 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Expense Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Expense Overview</h2>
            <p className="text-gray-400 text-sm">Track your spending trends over time and gain insights into where your money goes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
          >
            <Plus size={18} /> Add Expenses
          </button>
        </div>

        {/* Area/Wave Chart Container */}
        <div className="h-87.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={expenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0055ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0055ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#0055ff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                dot={{ r: 6, fill: '#0055ff', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. All Expenses Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary">All Expanses</h2>
          <button className="flex items-center gap-2 bg-back-ground px-4 py-2 rounded-xl text-xs font-bold text-primary border border-gray-100 hover:bg-gray-100 transition-all">
            Download <Download size={14} />
          </button>
        </div>

        {/* Expense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-primary/80 group-hover:scale-110 transition-transform"></div>
                <div>
                  <p className="font-bold text-primary">Shopping</p>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide">17 feb 2025</p>
                </div>
              </div>
              <div className="bg-back-ground px-4 py-2 rounded-2xl text-xs font-bold text-primary">
                -250 PKR
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Modal (Similar to Income but for Expenses) */}
    
    </div>
  );
};

export default Expenses;