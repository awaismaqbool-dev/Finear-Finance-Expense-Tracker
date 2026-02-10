import React from 'react';

const StatCard = ({ title, amount, icon, iconBg }) => {
  return (
    <div className="bg-white p-10 rounded-2xl flex flex-col justify-between h-53">
      <div className="flex items-center justify-between m-a">
        <h3 className="text-primary font-dmsans font-bold lg">{title}</h3>
        <div className={`${iconBg} p-2.5 rounded-4xl text-white`}>
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">PKR {amount}</h2>
        <button className="flex items-center gap-2 px-3 py-1 bg-back-ground rounded-lg text-[10px] font-medium text-primary uppercase">
          PKR <span className="text-[8px]">▼</span>
        </button>
      </div>
    </div>
  );
};

export default StatCard;

// Progress Bar Component for Cash in Hand/Bank
export const CashProgress = ({ label, amount, percentage, colorClass }) => (
  <div className="space-y-2 mb-11">
    <p className="text-primary text-lg font-dmsans mb-5">{label}</p>
    <h3 className="text-2xl font-bold text-primary">{amount} <span className="text-sm font-normal">PKR</span></h3>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);