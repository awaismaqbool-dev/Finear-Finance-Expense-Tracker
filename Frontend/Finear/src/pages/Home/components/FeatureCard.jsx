import React from "react";

function FeatureCard({ img, heading, body }) {
  return (
    <div
      className="
    mainBox border-2 border-back-ground w-72 h-90 m-auto rounded-2xl bg-white
    xl:w-92 xl:h-110
    "
    >
      <div
        className="childDiv w-68 h-64 m-auto mt-2 rounded-2xl bg-back-ground flex justify-center items-center
      xl:w-86 xl:h-82
      "
      >
        <div className="p-2">
          <img
            className="max-h-full max-w-full object-contain"
            src={img}
            alt="grph"
          />
        </div>
      </div>
      <div
        className=" h-24 flex justify-center flex-col pl-2
      xl:pl-3
      "
      >
        <h1
          className=" 
        font-semibold text-secondary"
        >
          {heading}
        </h1>
        <p
          className="
        text-primary text-[0.7em] w-[95%]"
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export default FeatureCard;
