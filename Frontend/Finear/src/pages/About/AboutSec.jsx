import React from "react";

function AboutSec({ src, heading1, middelTaxt, headin2, body, body2}) {
  return (
    <section className="
      w-full
      py-16
    ">
      <div className="
        max-w-6xl mx-auto
        px-4
        flex flex-col gap-10
        md:flex-row md:items-center
      ">
        
        {/* TEXT */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="
            text-4xl
            lg:text-5xl
            font-semibold text-primary
          ">
            {heading1}
            <span className="bg-bule-gradient bg-clip-text text-transparent">
              {middelTaxt}
            </span>
            {headin2}
          </h2>

          <p className="
            mt-4
            text-sm lg:text-base
            leading-relaxed
            text-primary/80
          ">
            {body}
          </p>

          <p className="
            mt-2
            text-sm lg:text-base
            leading-relaxed
            text-primary/80
          ">
            {body2}
          </p>
        </div>

        {/* IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-72 lg:w-100 rounded-2xl overflow-hidden">
            <img
              src={src}
              alt="about"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>

      </div>
    </section>
  );
}


export default AboutSec;

{/*
    function AboutSec({ src, heading1, middelTaxt, headin2, body, body2 }) {
  return (
    <div className="w-full bg-white border flex flex-col items-center
    md:flex-row md:justify-around
    lg:h-[45vh]
    xl:h-[55vh] 
    2xl:w-[70%] 2xl:m-auto

    ">
<div
        className="content text-primary text-center font-semibold border p-5
        md:w-[40%] md:text-left md:flex md:flex-col md:justify-center
        
        "
      >
        <h2 className="headig text-4xl
        lg:text-5xl
        xl:text-6xl
        ">
          {heading1}
          <span className="bg-bule-gradient bg-clip-text text-transparent">
            {middelTaxt}
          </span>
          {headin2}
        </h2>
        <p className="body text-[0.8rem] font-normal leading-4 mt-3
        lg:text-[0.9rem]
        xl:text-[1rem]
        ">{body}</p>
        <p className="body text-[0.8rem] font-normal leading-4
        lg:text-[0.9rem]
        xl:text-[1rem]
        ">{body2}</p>
      </div>
      <div className="img w-70 m-auto mt-5 mb-8 rounded-2xl overflow-clip 
      md:m-0 md:mt-8 md:mb-8
      lg:w-80
      xl:w-100
      2xl:w-110
      ">
        <img
          className=" w-full h-full object-cover pointer-events-none"
          src={src}
          alt="img"
        />
      </div>
    </div>
  );
}
     */}