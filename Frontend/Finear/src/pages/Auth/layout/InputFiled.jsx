import { Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react'

function InputFiled({value, lable, placeholder, type, onChange}) {
  const [showPassword, setShowPassword]=useState(false);
  const toggelShowPassword=()=>{
    setShowPassword(!showPassword);
  }
  return (
    <div className='flex flex-col gap-4 '>
      <label className='text-primary ' htmlFor={type}>{lable}</label>
<div className='flex justify-end items-center relative'>
        <input className=' 
      w-full bg-back-ground 
      rounded-full py-2
      px-3 placeholder:text-sm 
      border-none
      focus:outline-none
      focus: shadow
      ' type={type=="password"? showPassword? 'text':'password':type} 
      placeholder={placeholder} 
      onChange={onChange}
      value={value}
      id={type}
      />
{
  type==="password"&&(
    <>
    {showPassword?(
            <EyeClosed  
      className=' absolute mx-5 opacity-25 cursor-pointer'
      onClick={()=>toggelShowPassword()}
      />
    ):(
      <Eye
      className=' absolute mx-5 opacity-25 cursor-pointer'
      onClick={()=>toggelShowPassword()}
      />
    )
    }
    </>
  )
}
</div>
    </div>
  )
}

export default InputFiled
