import React from "react";
import { useState } from "react";
import ProfileDropdown from "./profileDropdown";
import Sidebar from "../common/Sidebar";
import { Menu, Verified } from "lucide-react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../../../api";

function DashboardLayout() {
  const navigate = useNavigate();
  // 1. State for user data
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Backend placeholder data
  const [userData, setuserData] = useState({
    name: "User",
    email: "",
    profilePic: "",
    verified: false,
  });
  // 2. Loading state taakay API fetch hote waqt white screen na aaye
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("/dashboard/loadProfile");
        if (response.data.success) {
          setuserData(response.data.userData);
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [navigate]);
  // 3. Restriction Logic
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-back-ground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <span className="ml-3 text-primary font-medium">Loading Finear...</span>
      </div>
    );
  }
  return (
    // Main Wrapper: Sidebar aur Content area side-by-side aayenge
    <div>
      {/* Top Header Section */}
      <header className="p-4 lg:p-10 flex justify-between items-center bg-back-ground">
        <div className="flex gap-6 items-center">
          {/* Hamburger: Sirf mobile par dikhega (lg:hidden) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-primary bg-white rounded-xl lg:hidden shadow-sm"
          >
            <Menu size={24} />
          </button>
          <img
            src="/logo.svg"
            alt="Finear"
            className="w-30 md:w-37"
            onClick={()=>{navigate("/")}}
          />
        </div>

        {/* Profile Section */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all "
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={userData.profilePic}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white shadow-sm object-cover"
            alt=""
          />
          <span className="hidden md:block font-medium text-primary text-xl">
            {userData.name}
          </span>
        </div>
      </header>
      <div className="flex min-h-screen bg-back-ground font-dmsans">
        {/* 1. Sidebar: Desktop par fix, mobile par slide-in */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(false)}
          img={userData.profilePic}
          userName={userData.name}
        />

        {/* 2. Main Content Area: Desktop par margin left hoga taakay sidebar ke niche na aaye */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-70 transition-all duration-300">
          {/* Dynamic Content: Welcome text aur Dashboard page */}
          <main className="p-4 lg:px-10 flex-1 ">
            <h1 className="text-2xl md:text-5xl font-medium text-primary mb-8">
              Welcome Back, {userData.name}
            </h1>
            <Outlet context={{ userData }} />
          </main>

          {/* Profile Dropdown */}
          <ProfileDropdown
            user={userData}
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            img={userData.profilePic}
          />
        </div>
      </div>
      <div className="footerBar w-full h-15 bg-navy-gradient flex justify-between px-6">
        <img
          className="p-5 lg:p-3"
          src="/logoWhite.svg"
          alt="logo"
        />
        <p
          className=" text-white text-right flex justify-center items-center text-[0.6rem] pr-3 
                md:text-[0.8rem]"
        >
          © 2026 Finear. All Rights Reserved Your Trusted Finance Partner
        </p>
      </div>
    </div>
  );
}

export default DashboardLayout;
