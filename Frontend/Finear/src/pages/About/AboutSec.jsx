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

