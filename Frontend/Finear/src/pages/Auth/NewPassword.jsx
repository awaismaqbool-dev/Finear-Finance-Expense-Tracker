import React, { useState } from 'react'
import InputFiled from './layout/InputFiled'
import { Link, useNavigate } from 'react-router-dom';

function NewPassword() {
  const [password, setPassword]=useState("");
  const [error, setError]=useState(null);

/// handleLogin funtion 
const handleLogin = async(e)=>{

  e.preventDefault();
        setError("")
const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email format");
    return;
  }
  if (!password) {
      setError("please Enter a valid email password");
      return;
    }
    if (password.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }
  // Agar sab theek hai
  console.log("Login Success:", { email, password });
  // Yahan aap apni API call kar sakte hain
};

  return (
    <div className=' w-full
    max-w-2xl
    
    '>
      <div className='text-center text-primary  my-10'>
        <h1 className='text-2xl font-semibold capitalize
        xl:text-4xl
        '>Type new password</h1>
      <p className='text-sm text-wrap w-full m-auto my-3
      md:max-w-[50%]
      '>Create and confirm your new password, then sign in again</p>
      </div>
      <form onSubmit={handleLogin} className=' mx-5 flex flex-col gap-5'>
       <InputFiled
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          lable="Enter Your Password"
          placeholder="Minimum 8 characters"
          type="password"
        />
        <p className='text-sm text-red-900 capitalize'>{error}</p>
        <button type="submit" className=' cursor-pointer bg-bule-gradient text-lg text-white p-2 rounded-2xl'>Signup</button>
        <p>Your password has been successfully updated <Link className=' underline text-blue-900 ' to="/auth/login" >Login</Link></p>
      </form>
    </div>
  )
}

export default NewPassword
