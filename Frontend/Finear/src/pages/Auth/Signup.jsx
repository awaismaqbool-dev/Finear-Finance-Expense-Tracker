import React, { useState } from "react";
import InputFiled from "./layout/InputFiled";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../../api";

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (formData) => {
    try {
      //Axios (API) call
      const response = await API.post("/authSystem/register", formData);
      if (response.data.success) {
        alert(`Signup Successfully, ${formData.name}`);
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      alert(errorMsg);
      console.log("Signup failed:", errorMsg);
    }
  };
  return (
    <div className=" w-full max-w-2xl">
      <div className="text-center text-primary  my-10">
        <h1 className="text-2xl font-semibold xl:text-4xl">
          Sign Up For Free.
        </h1>
        <p
          className="text-sm text-wrap w-full m-auto my-3
      md:max-w-[50%]"
        >
          Get your Finer Dashboard{" "}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" mx-5 flex flex-col gap-5"
      >
        <InputFiled
          lable="Full Name"
          placeholder="Enter Full Name"
          type="text"
          {...register("name", { required: "Name is requied" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
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
        <InputFiled
          lable="Enter Your Password"
          placeholder="Minimum 8 characters"
          type="password"
          {...register("password", {
            required: "Password is Requried",
            minLength: { value: 8, message: "password must be 8+ chrachter" },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className=" cursor-pointer bg-bule-gradient text-lg text-white p-2 rounded-2xl"
        >
          Sign up
        </button>

        <p>
          Do you have an account?{" "}
          <Link className=" underline text-blue-900 " to="/auth/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
