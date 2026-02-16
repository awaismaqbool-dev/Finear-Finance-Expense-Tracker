import React, { useState } from "react";
import InputFiled from "./layout/InputFiled";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../../api";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const gotoForgetpassword = () => {
    navigate("/password/forget-password");
  };

  // fetch api  funtion
  const onSubmit = async (formData) => {
    try {
      //Axios (API) call
      setLoading(true)
      const response = await API.post("/authSystem/login", formData);
      if (response.data.success) {
        alert(`Login Successfully`);
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      alert(errorMsg);
      console.log("login failed:", errorMsg);
    }finally {
        setLoading(false);
      }
  };
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-back-ground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <span className="ml-3 text-primary font-medium">Loading Finear...</span>
      </div>
    );
  }

  return (
    <div
      className=" w-full
    max-w-2xl
    
    "
    >
      <div className="text-center text-primary  my-10">
        <h1
          className="text-2xl font-semibold
        xl:text-4xl
        "
        >
          Login
        </h1>
        <p
          className="text-sm text-wrap w-full m-auto my-3
      md:max-w-[50%]
      "
        >
          Enter your email and password to securely access your account and
          manage your services.
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
        <InputFiled
          lable="Enter Your Password"
          placeholder="Minimum 8 characters"
          type="password"
          {...register("password", {
            required: "Password is Requried",
            minLength: { value: 8, message: "password must be 8+ chrachter" },
          })}
        />
        <div className="flex justify-between">
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <p
            className="text-md underline text-primary capitalize cursor-pointer"
            onClick={gotoForgetpassword}
          >
            Forget Password
          </p>
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className=" cursor-pointer bg-bule-gradient text-lg text-white p-2 rounded-2xl"
        >
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link className=" underline text-blue-900 " to="/auth/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
