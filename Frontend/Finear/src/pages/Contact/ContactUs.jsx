import React from "react";

import GetInTouch from "./GetInTouch";
import ContactForm from "./ContactForm";
import Faqs from "./FaqSec";
import Content from "../../components/common/Content";
import { Start_Button } from "../../components/common/Buttons";

function ContactUs() {
  return (
    <div>
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
            heading1="Let's "
            middelTaxt="Talk"
            headin2="About Finear"
            body="Have a question, feedback, or idea? Feel free to reach out. We’d love to hear from you."
          />
          <div className="mt-8 flex justify-center">
            <Start_Button />
          </div>
        </div>
      </div>
      <div
        className="
              sec2 bg-white w-full py-16
              flex flex-col items-center gap-15
              md:flex-row md:justify-center
              px-3
              mx-auto
              lg:gap-50
              "
      >
        <GetInTouch />
        <ContactForm />
      </div>
      <div
        className="             
         sec2 bg-back-ground w-full py-16
              flex flex-col items-center gap-10
              md:flex-row md:justify-center
              px-3
              mx-auto
              lg:gap-50"
      >
        <Faqs />
      </div>
    </div>
  );
}

export default ContactUs;
