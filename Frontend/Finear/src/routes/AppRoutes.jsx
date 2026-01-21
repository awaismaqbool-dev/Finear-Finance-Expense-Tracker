import React from "react";
import { Route, Routes } from "react-router-dom";
// layouts
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

//pages
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import ContactUs from "../pages/Contact/ContactUs";

import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/login";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import NewPassword from "../pages/Auth/NewPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Dashboard from "../pages/Dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Group 1: Jin pages par Navbar aur Footer chahiye */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
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
        <Route path="new-password" element={<NewPassword />} />
      </Route>
      {/* Group 3: otp page */}
      
      <Route
        path="/verification"
        element={
          <AuthLayout
            img="../src/assets/auth_img2.png"
            heading="Don’t worry.We’ve got you."
            body="© 2026 Finear. All rights reserved your trusted finance partner"
          />
        }
      >
<Route path="otp" element={<VerifyOtp/>} />
      </Route>

      {/* Group 3: Dashboard & 404 (No Navbar/Footer) */}
       <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
};
export default AppRoutes;
