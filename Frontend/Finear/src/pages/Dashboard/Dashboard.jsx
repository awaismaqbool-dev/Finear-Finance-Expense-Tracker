import React, { useEffect, useState } from "react";
import StatCard, { CashProgress } from "../../components/common/StartCard";
import { Wallet, Download, ShieldCheck, CreditCard } from "lucide-react";
import GoalChart from "../../components/common/GoalCart";
import API from "../../../api"; 
import {useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  // 1. Fetch Logic
  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/dashboard/"); // Ensure correct endpoint
      if (response.data.success) {
        setData(response.data);
        console.log(setData.monthlyBudget);
        
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 2. Budget Handler (Prompt for simplicity, you can make a modal later)
  const handleSetBudget = async () => {
    const newBudget = prompt("Enter your monthly budget amount:");
    if (newBudget && !isNaN(newBudget)) {
      try {
        const res = await API.post("/dashboard/updateBudget", { budget: Number(newBudget) });
        if (res.data.success) {
          fetchDashboardData(); // Refresh data
          alert("Budget updated successfully!");
        }
      } catch (err) {
        alert("Failed to update budget");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Fetching your finances...</div>;

  // 3. Percentage Calculation Logic
  // Total Income ko 100% maan kar balances ki percentage nikalna
  const totalIncome = data?.userData?.income || 0;
 const handPercent = totalIncome > 0 ? Math.min(Math.round((data?.userData?.handBalance / totalIncome) * 100), 100) : 0;
  const bankPercent = totalIncome > 0 ? Math.min(Math.round((data?.userData?.bankBalance / totalIncome) * 100), 100) : 0;

  return (
    <div className="bg-back-ground py-4 md:py-10 font-dmsans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Balance" amount={data?.userData?.totalBalance} icon={<Wallet size={20} />} iconBg="bg-secondary" />
            <StatCard title="Total Income" amount={data?.userData?.income} icon={<Download size={20} />} iconBg="bg-[#FFB11A]" />
            <StatCard title="Total Savings" amount={data?.userData?.savings} icon={<ShieldCheck size={20} />} iconBg="bg-primary" />
            <StatCard title="Total Expense" amount={data?.userData?.expense} icon={<CreditCard size={20} />} iconBg="bg-[#2D3A82]" />
          </div>

          {/* Real Transactions List */}
          <div className="bg-white p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-primary">Recent Transactions</h3>
              <button className="bg-back-ground px-4 py-2 rounded-xl text-xs font-medium text-primary hover:bg-gray-100 transition-all"
              onClick={()=>{navigate("/dashboard/expenses")}}>
                See All →
              </button>
            </div>

            <div className="space-y-6">
              {data?.recentTransactions?.length > 0 ? (
                data.recentTransactions.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-primary">{item.category || item.description || "Transaction"}</p>
                        <p className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                    <div className="bg-back-ground px-4 py-2 rounded-xl text-xs font-medium text-primary">
                      {item.type === 'Expense' ? '-' : '+'}{item.amount} PKR
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No transactions found</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-3xl flex flex-col">
            <CashProgress label="Cash In Hand" amount={data?.userData?.handBalance} percentage={handPercent} colorClass="bg-[#00D715]" />
            <CashProgress label="Cash In Bank" amount={data?.userData?.bankBalance} percentage={bankPercent} colorClass="bg-[#0c58e8]" />
          </div>

          {/* Monthly Budget Section */}
          <div className="bg-white p-8 rounded-3xl text-center flex flex-col gap-3">
            <h4 className="text-primary font-dmsans font-bold">Monthly Budget</h4>
            <h2 className="text-2xl font-semibold text-primary">
              PKR {data?.userData?.monthlyBudget?.toLocaleString() || "0.00"}
            </h2>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={handleSetBudget}
                className="bg-[#00D715] text-white px-4 py-2 rounded-xl text-[10px] font-bold"
              >
                Set Monthly Budget
              </button>
              <button className="bg-back-ground px-4 py-2 rounded-xl text-[10px] font-bold text-primary ">
                PKR ▼
              </button>
            </div>
          </div>
          <GoalChart userGoals={data?.activeGoals} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;