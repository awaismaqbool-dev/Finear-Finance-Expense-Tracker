import React from "react";

function Steps({ number, heading, body, align = "left" }) {
  const textAlign =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";
  const iteamsAlign =
    align === "center"
      ? "items-center"
      : align === "right"
      ? "items-end"
      : "iteams-start";
  return (
    <div className={`flex flex-col ${iteamsAlign} ${textAlign} `}>
      <div className="number font-dmsans">
        <h1
          className="text-8xl font-black bg-[linear-gradient(180deg,#2D71E9_24.87%,#F0F6FB_82.07%)] bg-clip-text text-transparent translate-y-5
      lg:text-9xl

      "
        >
          {number}
        </h1>
      </div>

      <div className={` flex flex-col ${iteamsAlign}`}>
        <h3
          className=" font-dmsans font-semibold
        md:text-[0.8rem]
        lg:text-xl
        xl:text-3xl

        "
        >
          {heading}
        </h3>
        <p
          className="
        font-dmsans font-normal text-[0.7rem] w-60
        md:text-[0.6rem] md:w-52
        lg:text-xs
        xl:text-[1rem] xl:w-75
        "
        >
          {body}
        </p>
        <div className="circle w-10 h-10 bg-white rounded-2xl flex mt-5">
          <div className="w-8 h-8 bg-bule-gradient rounded-2xl m-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default Steps;
