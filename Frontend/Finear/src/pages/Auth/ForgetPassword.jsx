import React, { useState } from "react";
import InputFiled from "./layout/InputFiled";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../../api";

function ForgetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // handle send otp funtion to server from email
  const onSubmit = async (formData) => {
    try {
      //Axios (API) call
      const response = await API.post("/authSystem/forget-pasword", formData);
      if (response.data.success) {
        localStorage.setItem("email", formData.email);
        alert("otp send Successfully");
        navigate("/password/otp");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      alert(errorMsg);
      console.log("otp sending failed:", errorMsg);
    }
  };
  return (
    <div className=" w-full max-w-2xl">
      <div className="text-center text-primary  my-10">
        <h1
          className="text-2xl font-semibold
        xl:text-4xl"
        >
          Forgot Password
        </h1>
        <p
          className="text-sm text-wrap w-full m-auto my-3
      md:max-w-[50%]"
        >
          Enter your email address to receive a OPT and regain access to your
          account.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" mx-5 flex flex-col gap-5"
      >
        <InputFiled
          lable="Email Address"
          placeholder="example@email.com"
          type="email"
          {...register("email", {
            required: "Email is Required ",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <button
          type="submit"
          className=" cursor-pointer bg-bule-gradient text-lg text-white p-2 rounded-2xl"
        >
          Signup
        </button>
        <p>
          Don't have an account?{" "}
          <Link className=" underline text-blue-900 " to="/auth/signup">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgetPassword;
