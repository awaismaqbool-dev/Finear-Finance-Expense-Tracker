import React, { useState, useRef } from 'react';
import AuthLayout from '../../components/layout/AuthLayout'

function VerifyOtp() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Handle Input Change
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Sirf numbers allow hain

    let newOtp = [...otp];
    
    // Agar user 1 se zyada digit enter kare (aapki requirement ke mutabiq)
    // To hum sirf aakhri digit lenge aur agle box par shift ho jayenge
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Agle input par focus le jana
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste Functionality
  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.length === 6) {
      setOtp(data);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };
  return (
<div className="flex flex-col items-center justify-center min-h-screen p-4">
  {/* Card Container: Added w-[95%] for very small screens and max-w-md for larger ones */}
  <div className="w-full max-w-md text-center space-y-6 sm:space-y-8 p-6 sm:p-10 rounded-3xl">
    
    {/* Header */}
    <div className="space-y-2 text-primary">
      {/* text-2xl for mobile, text-3xl for tablets/desktop */}
      <h2 className="text-2xl sm:text-3xl font-bold">Verify your OTP</h2>
      <p className="text-xs sm:text-sm leading-relaxed">
        enter the one-time password you received via email <br className="hidden sm:block" /> into the required field
      </p>
    </div>

    {/* OTP Inputs Container: gap-2 for mobile, gap-4 for larger screens */}
    <div className="flex justify-center gap-2 sm:gap-4 my-6 sm:my-10">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          /* Responsive Width & Height: w-12/h-16 for mobile, w-16/h-20 for desktop */
          className="w-12 h-16 sm:w-16 sm:h-20 text-xl sm:text-2xl font-semibold text-center bg-back-ground border border-secondary rounded-xl sm:rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 text-blue-900 shadow-inner"
        />
      ))}
    </div>

    {/* Buttons */}
    <div className="space-y-3 sm:space-y-4">
      <button 
        className="w-full py-3 sm:py-4 bg-bule-gradient text-white rounded-full font-normal text-base sm:text-lg shadow-lg hover:opacity-90 transition-opacity active:scale-95"
        onClick={() => console.log("OTP Submitted:", otp.join(''))}
      >
        Continue
      </button>
      
      <button className="w-full py-3 sm:py-4 bg-back-ground text-primary rounded-full font-normal text-base sm:text-lg hover:bg-[#E2E8FF] transition-colors ">
        Send Again
      </button>
    </div>
  </div>
</div>
          
  )
}

export default VerifyOtp
