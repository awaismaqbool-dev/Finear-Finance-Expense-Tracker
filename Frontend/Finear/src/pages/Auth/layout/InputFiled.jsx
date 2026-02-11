import { Eye, EyeClosed } from 'lucide-react';
import React, { useState, forwardRef } from 'react';

const InputFiled = forwardRef(({ lable, placeholder, type, name, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggelShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className='flex flex-col gap-4 '>
      {/* Label hamesha unique ID se connect hona chahiye */}
      <label className='text-primary' htmlFor={name}>{lable}</label>
      
      <div className='flex justify-end items-center relative'>
        <input 
          className='w-full bg-back-ground rounded-full py-2 px-3 placeholder:text-sm border-none focus:outline-none focus:shadow'
          ref={ref} 
          name={name}
          id={name} // Type ki jagah Name use karein
          type={type === "password" ? (showPassword ? 'text' : 'password') : type} 
          placeholder={placeholder} 
          {...props} // Ismein onChange aur onBlur khud ba khud aa jayenge
        />

        {type === "password" && (
          <div onClick={toggelShowPassword} className='absolute mx-5 opacity-25 cursor-pointer'>
            {showPassword ? <EyeClosed /> : <Eye />}
          </div>
        )}
      </div>
    </div>
  );
});

export default InputFiled;