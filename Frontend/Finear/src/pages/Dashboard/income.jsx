import React from "react";
import { Plus, Download, Pencil, Trash } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";
import TransactionPopup from "../../components/popups/TransactionPopup";
import API from "../../../api";
import { useEffect } from "react";
import DeleteModal from "../../components/popups/DeletePopup";
import DeletePopup from "../../components/popups/DeletePopup";

const Income = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isDelPopUpOpen, setisDelPopUpOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  //fetch income data ----------------------------------------
  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/get-transactions?type=income");
      if (response.data.success) {
        setTransactions(response.data.transactions);
        // Backend se aane wala graphData format karke chart mein dalna
        // Agar backend se date-wise data chahiye toh hum wahan mapping karenge
        const formattedChart = response.data.transactions
          .slice(0, 7)
          .map((t, index) => ({
            // Date ke saath number (index) laga diya taake har point unique ho
            // 'reverse()' ki wajah se hum 'length - index' use kar rahe hain
            date: `${new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} (#${response.data.transactions.length - index})`,
            amount: Number(t.amount),
          }))
          .reverse();
        setChartData(formattedChart);
      }
    } catch (error) {
      console.error("Income fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  // get excel sheet funtion ---------------------------------------
  const getExcelSheet = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/dashboard/export-sheet?type=income",
        // ZAROORI: Axios ko batana hai ke dataya hai 'blob' (file) format mein hai
        {
          responseType: "blob",
        },
      );
      // 1. Browser ke liye file ka URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      //hidden link element
      const link = document.createElement("a");
      link.href = url;
      //File ka naam set
      link.setAttribute("download", "Finear_Expense_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      //Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(
        "Excel download fail: " + error.response?.data?.message ||
          error.message,
      );
    } finally {
      setLoading(false);
    }
  };
//open popup for editing funtion call
  const openEditPopup = (transactions) => {
    setSelectedTransaction(transactions); // Data set kiya
    setIsPopUpOpen(true); // Popup khola
  };
  //open popup for add tarnsaction funtion call
  const openAddPopup = () => {
    setSelectedTransaction(null); // Data clear (taake empty form khule)
    setIsPopUpOpen(true);
  };
  // funtion for set popup for delete button
const openDeletPopup = (transactions) => {
    setSelectedTransaction(transactions); // Data set kiya
    setisDelPopUpOpen(true); // Popup khola
  };
  useEffect(() => {
    fetchIncomeData();
  }, []);
  if (loading)
    return <div className="p-10 text-center">Loading Income Data...</div>;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Income Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Income Overview</h2>
            <p className="text-gray-400 text-sm">
              Track your earnings over time and analyze your income trends.
            </p>
          </div>
          <button
            onClick={() => openAddPopup()}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Plus size={18} /> Add Income
          </button>
        </div>

        {/* Bar Chart Container */}
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                allowDuplicatedCategory={true}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                domain={[0, "auto"]}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
              />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar
                dataKey="amount"
                fill="#0055ff"
                radius={[15, 15, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Income Sources Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary">Income Sources</h2>
          <button
            className="flex items-center gap-2 bg-back-ground px-4 py-2 rounded-xl text-xs font-bold text-primary border border-gray-100 hover:bg-gray-100 transition-all"
            onClick={() => {
              getExcelSheet();
            }}
          >
            Download <Download size={14} />
          </button>
        </div>

        {/* Transactions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 ">
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-green-500 group-hover:scale-110 transition-transform"></div>
                  <div>
                    <p className="font-bold text-primary">
                      {item.title || item.category}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div
                    onClick={() => openEditPopup(item)}
                    className="cursor-pointer hover:text-secondary transition-colors p-1 flex flex-rox gap-5"
                  >
                    <Pencil size={13} />
                  </div>
                  <div onClick={() => openDeletPopup(item)}
                  className="cursor-pointer hover:text-secondary transition-colors p-1 flex flex-rox gap-5">
        
                    <Trash size={13} />
                  </div>
                  <div className="bg-back-ground px-4 py-2 rounded-2xl text-xs font-bold text-green-600">
                    +{item.amount.toLocaleString()} PKR
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-2 text-center py-10">
              No income records found.
            </p>
          )}
        </div>
      </div>
      <TransactionPopup
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        initialData={selectedTransaction}
        type="income"
        name="Income"
        onSuccess={fetchIncomeData}
      />
      <DeletePopup
      isOpen={isDelPopUpOpen}
      onClose={() => setisDelPopUpOpen(false)}
      transaction={selectedTransaction}
      onSuccess={fetchIncomeData}
      />
    
    </div>
  );
};

export default Income;
