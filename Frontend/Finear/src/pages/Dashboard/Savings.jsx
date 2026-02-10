import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Savings = () => {
// Backend se data isi format mein aayega
  const [goals, setGoals] = useState([
    { id: 1, title: 'IPhone 13', priority: 'High', current: 75000, target: 200000 },
    { id: 2, title: 'MacBook Air', priority: 'Medium', current: 120000, target: 250000 },
    { id: 3, title: 'Car Fund', priority: 'High', current: 160000, target: 1200000 },
  ]);

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Recent Savings Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl ">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Recent Savings</h2>
            <p className="text-gray-400 text-sm italic">Track your earnings over time and analyze your income trends.</p>
          </div>
          <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
            <Plus size={18} /> Add Savings
          </button>
        </div>

        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Bar dataKey="amount" fill="#0055ff" radius={[15, 15, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

{/* 2. Active Goals Section */}
      <div className="bg-white p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-medium text-gray-400">Active Goals</h2>
          <button className="bg-secondary text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
            + Add Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-16">
          {goals.map((goal) => {
            // Dynamic Percentage Calculation
            const percentage = Math.min((goal.current / goal.target) * 100, 100);

            return (
              <div key={goal.id} className="group">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-1">{goal.title}</h3>
                    <p className="text-gray-400 font-medium">Priority: <span className="text-primary">{goal.priority}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-medium">Target Amount <span className="text-primary text-2xl ml-2">{goal.target.toLocaleString()}</span></p>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-full bg-gray-100 h-4 rounded-full">
                  
                  {/* The Dynamic Bar (Green/Yellow as per design) */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#00ff22] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,255,34,0.3)]"
                    style={{ width: `${percentage}%` }}
                  >
                    {/* The Blue Dot (Hover Trigger) */}
                    <div className="absolute -right-2 -top-1.5 w-7 h-7 bg-secondary rounded-full border-4 border-white cursor-pointer shadow-md flex items-center justify-center group/dot">
                      
                      {/* Status Pop-up (Visible only on hover) */}
                      <div className="opacity-0 group-hover/dot:opacity-100 group-hover/dot:-top-16 absolute transition-all duration-300 pointer-events-none flex flex-col items-center w-32">
                        <div className="bg-[#E5EFF9] text-primary text-[10px] font-black px-3 py-2 rounded-xl shadow-lg border border-blue-100 text-center uppercase tracking-tighter">
                          Current Status
                          <div className="text-sm font-bold mt-0.5">{goal.current.toLocaleString()} PKR</div>
                        </div>
                        {/* Tooltip triangle tail */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#E5EFF9]"></div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Savings;