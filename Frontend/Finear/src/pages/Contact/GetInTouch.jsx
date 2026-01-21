import React from "react";

function GetInTouch() {
  return (
    <div>
      <div
        className="
        content text-center
        text-primary flex flex-col gap-2
        md:text-left 
        lg:text-5xl lg:gap-5  
        "
      >
        <h2
          className="
font-semibold text-4xl mt-10" 
        >
          Get In Touch
        </h2>
        <p
          className="
           text-gray-400
          text-sm
          lg:text-base
          "
        >
          Send us your questions or feedback anytime.
        </p>
        <p
          className="
 text-[0.8em] font-semibold
          text-sm
          lg:text-base lg:bg-back-ground lg:p-5 lg:rounded-2xl
 "
        >
          awi.ah142@gmail.com
        </p>
        <p
          className="
 text-[0.8em] font-semibold
          text-sm
          lg:text-base
 "
        >
          Response Line
        </p>
        <p
          className="
 text-[0.8em] text-gray-400
          text-sm
          lg:text-base
 "
        >
          We usually reply within 1–2 working days.
        </p>
      </div>
    </div>
  );
}

export default GetInTouch;
