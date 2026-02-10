import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const GoalChart = ({ userGoals = [] }) => {
  // Logic: Hamesha 4 slots dikhane hain
  const data = Array.from({ length: 4 }, (_, i) => {
    const goal = userGoals[i];
    return {
      name: goal ? goal.title : '-',
      progress: goal ? goal.percentage : 0,
    };
  });

  return (
    <div className="bg-white p-6 rounded-3xl  w-full">
      <p className="text-[10px] font-bold text-primary mb-6 uppercase tracking-wider">
        Active Goal Status
      </p>
      
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            {/* Background Lines */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#202c75', fontSize: 10, fontWeight: 'bold' }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              ticks={[0, 25, 50, 75, 100]}
              domain={[0, 100]}
            />

            <Bar 
              dataKey="progress" 
              radius={[10, 10, 0, 0]} 
              barSize={35}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === '-' ? '#f3f4f6' : '#0c58e8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GoalChart;