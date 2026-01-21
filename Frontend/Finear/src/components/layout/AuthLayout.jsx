import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout({ img, heading, body }) {
  return (
    <div className="parent bg-white w-full h-screen font-dmsans flex">
      <div
        className="
        w-[45%] h-screen 
         hidden relative
        sm:flex sm: items-end sm:justify-center
        "
      >
        <div
          className=" absolute 
        my-10
        2xl:my-20
        text-center text-white"
        >
          <h1
            className=" 
            font-semibold
            text-3xl 
            capitalize
            lg:text-4xl
            2xl:text-5xl
            "
          >
            {heading}
          </h1>
          <p className="my-5 text-sm">{body}</p>
        </div>

        <img
          className="object-cover  object-top w-full h-full"
          src={img}
          alt=""
        />
      </div>
      <div
        className="w-full flex justify-center items-center flex-col
      md:w-[55%]
      "
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
