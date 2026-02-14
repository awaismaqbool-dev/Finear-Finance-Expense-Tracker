import React from "react";
import Content from "../../components/common/Content";
import { Start_Button } from "../../components/common/Buttons";
import AboutSec from "./AboutSec";

function About() {
  return (
    <div className="main">
      <div
        className="
         w-full h-[70vh] flex justify-center items-center flex-col relative overflow-hidden  
        xl:h-120
        2xl:h-150
        "
      >
        <img
          className="absolute pointer-events-none"
          src="/background_img.png"
          alt=""
        />
        <div className="absolute z-10 capitalize">
          <Content
            heading1="Every"
            middelTaxt="Feature"
            headin2="is Designed for real people"
            body="Finear is developed as a personal project to explore modern UI, user experience, and finance-focused product design."
          />
          <div className="mt-8 flex justify-center">
            <Start_Button />
          </div>
        </div>
      </div>
      <div className="w-full bg-white">
        <AboutSec
          src="/behind_story_img.png"
          heading1="The "
          middelTaxt="Story"
          headin2=" Behind Finear."
          body="Finear is a personal finance project built to help people understand, track, and manage their money in a simple way."
          body2="The goal of Finear is to remove confusion from financial tracking and give users a clear view of their finances."
        
        />
        <div className="bg-back-ground">
                   <AboutSec
          src="/prurpo_img.png"
          heading1="Driven by Purpose, "
          middelTaxt="Guided"
          headin2="  by Vision."
          body="Managing money is often stressful and unclear. Many tools are complex and hard to use. Finear was created to make financial tracking simple, clean, and easy for everyday users."
          body2="This project focuses on clarity, usability, and real-life financial needs."
        
        />
        </div>

      </div>
    </div>
  );
}

export default About;

