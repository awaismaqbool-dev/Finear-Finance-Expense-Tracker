import React from "react";
import { Route, Routes } from "react-router-dom";
// layouts
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

//pages
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import ContactUs from "../pages/Contact/ContactUs";

import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import NewPassword from "../pages/Auth/NewPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Income from "../pages/Dashboard/income";
import Expenses from "../pages/Dashboard/expenses";
import Savings from "../pages/Dashboard/Savings";
import Dashboard from "../pages/Dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Group 1: Jin pages par Navbar aur Footer chahiye */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/about-us" element={<About/>} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
      {/* Group 2: Auth Pages (No Navbar/Footer) */}
      <Route
        path="/auth"
        element={
          <AuthLayout
            img="../src/assets/auth_img.png"
            heading="Feel confident about your finances."
            body="© 2026 Finear. All rights reserved your trusted finance partner"
          />
        }
      >
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
        path="/password"
        element={
          <AuthLayout
            img="../src/assets/auth_img2.png"
            heading="Don’t worry.We’ve got you."
            body="© 2026 Finear. All rights reserved your trusted finance partner"
          />
        }
      >
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="otp" element={<VerifyOtp/>} />
        <Route path="new-password" element={<NewPassword />} />
      </Route>

{/*gorp 4 :Standard Dashboard Routing */}
<Route path="/dashboard" element={<DashboardLayout />}>
  {/* index ka matlab hai ke jab sirf /dashboard khule toh ye page dikhe */}
  <Route index element={<Dashboard />} /> 
  <Route path="income" element={<Income />} />
  <Route path="expenses" element={<Expenses />} />
  <Route path="savings" element={<Savings />} />
</Route>

    </Routes>


  );
};
export default AppRoutes;
