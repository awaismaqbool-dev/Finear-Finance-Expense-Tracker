import React from "react";
import Content from "../../components/common/Content";
import { Start_Button } from "../../components/common/Buttons";



function Hero() {
  return (
    <>
      {/* Main Hero Container */}
      <div className="w-full p-5 pb-0">
        {/* main hero content*/}
        <div
          className="
         w-full h-100 flex justify-center items-center flex-col relative
        xl:h-120
        2xl:h-150
        "
        >
          <img
            className="absolute pointer-events-none"
            src="/background_img.png"
            alt=""
          />
          <div className="absolute z-10">
            <Content
              heading1="Take"
              middelTaxt="Control"
              headin2="Of Your Finances With Finear"
              body="Finear helps you track, plan, and understand your money in one simple place. No confusion. No spreadsheets. Just clear financial control"
            />
            <div className="mt-8 flex justify-center">
              <Start_Button />
            </div>
          </div>
        </div>
        {/* dashbaord image div */}
        <div
          className="h-50 overflow-hidden relative
        md:h-80
        lg:h-100"
        >
          <div
            className="
          w-[90%] m-auto p-1 bg-bule-gradient rounded-xl
          md:rounded-2xl md:p-2
          lg:w-[80%] lg:rounded-3xl
          xl:w-[65%]
          2xl:w-[60%]"
          >
            <img
              className=" object-contain w-full h-full rounded-xl m-auto"
              src="/dashbaord.png"
              alt="dashbaord img"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-3 bg-bule-gradient "></div>
    </>
  );
}

export default Hero;
