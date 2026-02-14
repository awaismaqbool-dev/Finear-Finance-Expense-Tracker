import React from "react";
import { Start_Button } from "./Buttons";

function Footer() {
  return (
    <div className="parent w-full bg-white pt-10">
      <div
        className="footerTab w-[90vw] h-100 bg-bule-gradient rounded-4xl border-9 border-back-ground m-auto flex flex-col items-center gap-5 justify-center relative mb-10 
        2xl:w-[58vw]
        "
      >
        <h1
          className="font-dmsans text-2xl w-full font-semibold capitalize text-white text-center
        md:text-3xl md:w-90
        lg:text-4xl lg:w-100
        xl:text-5xl xl:w-150
        "
        >
          Ready to take your finance partner - Finear
        </h1>
        <p
          className=" capitalize font-dmsans text-white text-center text-[0.8rem]
        md:text-[1rem] md:w-80
        xl:text-[1.5rem] xl:w-120
      
        "
        >
          Start managing your money with clarity, control, and confidence.
        </p>
        <div>
          <Start_Button
            colorClass="bg-back-ground"
            textClass="text-bule-background"
          />
        </div>
        <img
          className=" absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block opacity-50"
          src="/footer_lines.png"
          alt="img"
        />
      </div>

      <div
        className="footerBar w-full h-15 bg-navy-gradient flex justify-between
        md:pl-10 md:pr-10
      xl:h-16 xl:pl-18 xl:pr-18
      2xl:h-15 2xl:justify-around 2xl:pl-30 2xl:pr-30"
      >
        <img className="p-3" src="/logoWhite.svg" alt="logo" />
        <p
          className=" text-white text-right flex justify-center items-center text-[0.6rem] pr-3 
                md:text-[0.8rem]"
        >
          © 2026 Finear. All Rights Reserved Your Trusted Finance Partner
        </p>
      </div>
    </div>
  );
}

export default Footer;
{
  /*


   */
}
