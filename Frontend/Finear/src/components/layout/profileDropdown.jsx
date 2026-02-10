import React from 'react';
import { Camera, Edit3, Lock, CheckCircle } from 'lucide-react';

const ProfileDropdown = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 md:p-10 pointer-events-none">
      {/* Background Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-sm pointer-events-auto" 
        onClick={onClose}
      ></div>

      {/* Dropdown Card */}
      <div className="relative bg-white w-full max-w-[320px] h-fit rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center pointer-events-auto mt-16 animate-in fade-in zoom-in duration-200">
        
        {/* Profile Image Section */}
        <div className="relative mb-4">
          <img 
            src={user?.profilePic || "../src/assets/profile_img.png"} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <button className="absolute bottom-1 right-1 bg-secondary p-2 rounded-full text-white shadow-lg border-2 border-white hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-primary mb-1">{user?.name || "Ava Charlotte"}</h2>
        <p className="text-gray-400 text-sm mb-6">{user?.email || "your@email.com"}</p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-2 bg-secondary/20 text-secondary font-bold py-3 rounded-xl hover:bg-secondary hover:text-white transition-all cursor-pointer">
            <Edit3 size={18} /> Edit Name
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-back-ground text-secondary font-bold py-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all cursor-pointer">
            <Lock size={18} /> Change Password
          </button>
        </div>

        {/* Verification Status */}
        <div className="pt-4 border-t border-gray-100 w-full flex justify-center items-center gap-2 text-secondary font-bold text-sm uppercase tracking-tight">
          Your Are Verified <CheckCircle size={16} className="text-green-500 fill-green-500/20" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;