import React from "react";
import { useState } from "react";
import StatCard, { CashProgress } from "../../components/common/StartCard";
import { Wallet, Download, ShieldCheck, CreditCard } from "lucide-react";
import GoalChart from "../../components/common/GoalCart";


const Dashboard = () => {
  // Dummy Data: Samjho backend se sirf ek goal aaya hai
  const [userGoals, setUserGoals] = useState([
    { title: "Bike", percentage: 45 },
  ]);
  return (
    <div className="bg-back-ground py-4 md:py-10 font-dmsans">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (Main Stats & Transactions) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 4 Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Grand Balance"
              amount="12,000.00"
              icon={<Wallet size={20} />}
              iconBg="bg-secondary"
            />
            <StatCard
              title="Total Income"
              amount="12,000.00"
              icon={<Download size={20} />}
              iconBg="bg-[#FFB11A]"
            />
            <StatCard
              title="Total Savings"
              amount="12,000.00"
              icon={<ShieldCheck size={20} />}
              iconBg="bg-primary"
            />
            <StatCard
              title="Total Expense"
              amount="12,000.00"
              icon={<CreditCard size={20} />}
              iconBg="bg-[#2D3A82]"
            />
          </div>

          {/* Recent Transactions Section */}
          <div className="bg-white p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-primary">
                Recent Transactions
              </h3>
              <button className="bg-back-ground px-4 py-2 rounded-xl text-xs font-medium text-primary hover:bg-gray-100 transition-all">
                See All →
              </button>
            </div>

            {/* Transaction List Placeholder */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium text-primary">Shopping</p>
                      <p className="text-[10px] text-gray-400">17 Feb 2025</p>
                    </div>
                  </div>
                  <div className="bg-back-ground px-4 py-2 rounded-xl text-xs font-medium text-primary">
                    -250 PKR
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Cash, Budget & Goals) */}
        <div className="lg:col-span-4 space-y-8 ">
          {/* Cash Status Card */}
          <div className="bg-white p-8 rounded-3xl  flex flex-col">
            <CashProgress
              label="Cash In Hand"
              amount="12,000.00"
              percentage={70}
              colorClass="bg-green-500"
            />
            <CashProgress
              label="Cash In Bank"
              amount="12,000.00"
              percentage={85}
              colorClass="bg-green-500"
            />
          </div>

          {/* Monthly Budget Card */}
          <div className="bg-white p-8 rounded-3xl text-center flex flex-col gap-3">
            <h4 className="text-primary font-dmsans font-bold lg">
              Monthly Budget
            </h4>
            <h2 className="text-2xl font-semibold text-primary">
              PKR 12,000.00
            </h2>
            <div className="flex gap-2 justify-center">
              <button className="bg-[#00D715] text-white px-4 py-2 rounded-xl text-[10px] font-bold">
                Set Monthly Budget
              </button>
              <button className="bg-back-ground px-4 py-2 rounded-xl text-[10px] font-bold text-primary ">
                PKR ▼
              </button>
            </div>
          </div>
          <GoalChart userGoals={userGoals} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
