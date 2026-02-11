import React, { useState } from 'react'
import InputFiled from './layout/InputFiled'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import API from "../../../api";

function NewPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
const onSubmit=async(formData)=>{
try {

  const storedEmail= localStorage.getItem("email");
  const finalData={
    ...formData,
    email:storedEmail
  }
  //Axios (API) call
      const response= await API.post("/authSystem/change-Password",finalData);
      if (response.data.success) {
        alert("Password Change Successfully");
      navigate('/auth/login');
  }else{
    alert(response.data.message);
  }
    } catch (error) {
      console.error("Full Error:", error.response?.data);
    alert(error.response?.data?.message || "Something went wrong on the server");
    }
}
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
      <form onSubmit={handleSubmit(onSubmit)}
       className=' mx-5 flex flex-col gap-5'>
       <InputFiled
          lable="Enter Your Password"
          placeholder="Minimum 8 characters"
          type="password"
          {...register ("password",{required:"Password is Requried",
            minLength:{value: 8 , message:"password must be 8+ chrachter"}
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <button
          disabled={isSubmitting}
          type="submit"className=" cursor-pointer bg-bule-gradient text-lg text-white p-2 rounded-2xl">Change Password</button>
      </form>
    </div>
  )
}

export default NewPassword
