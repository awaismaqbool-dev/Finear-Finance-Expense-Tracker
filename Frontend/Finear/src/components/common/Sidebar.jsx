import React from 'react';
import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, ShieldCheck, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
    { name: 'Income', icon: <ArrowDownLeft size={22} />, path: '/dashboard/income' },
    { name: 'Expenses', icon: <ArrowUpRight size={22} />, path: '/dashboard/expenses' },
    { name: 'Savings', icon: <ShieldCheck size={22} />, path: '/dashboard/savings' },
  ];

  return (
    <>
{/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar: 'lg:translate-x-0' desktop par dikhayega, '-translate-x-full' mobile par hide karega */}
      <aside className={` absolute top left-0 z-50 h-screen w-70 transition-transform duration-300 ease-in-out bg-white rounded-r-2xl
        lg:translate-x-0 lg:bg-transparent
        ${isOpen ? 'translate-x-0 ,' : '-translate-x-full'}`}>
        
        {/* Close Button for Mobile */}
    
        <div className="lg:hidden absolute top-5 right-5 ">
            <button onClick={toggleSidebar} className="text-primary p-2">
                <X size={24} />
            </button>
        </div>

        <div className="px-8 mb-10 text-center mt-12">
          <div className="relative inline-block">
             <img src="../src/assets/profile_img.png" className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover" alt="User" />
             <div className="absolute bottom-1 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
          </div>
          <h3 className="mt-4 font-bold text-primary text-lg">Ava Charlotte</h3>
        </div>

        <nav className="px-6 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-bold transition-all ${isActive ? 'bg-secondary text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-back-ground hover:text-primary'}`}>
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-10 w-full px-6">
          <button className="flex items-center gap-4 px-6 py-4 w-full text-gray-400 font-bold hover:text-red-500 transition-colors cursor-pointer">
            <LogOut size={22} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;