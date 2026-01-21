import React from "react";

function Content({ heading1, middelTaxt, headin2, body }) {
  return (
    <div className=" mr-5 ml-5">
      <div
        className="
content text-center text-4xl font-bold font-dmsans flex flex-col justify-center items-center 
md:text-6xl
lg:text-[4rem]
xl:w-[60vw]
2xl:2xl:text-7xl
"
      >
        <h1 className="text-primary">
          {heading1}{" "}
          <span className="bg-bule-gradient bg-clip-text text-transparent">
            {middelTaxt}
          </span>{" "}
          {headin2}
        </h1>
        <p
          className="
        font-normal text-[0.65rem] mx-auto font-dmsans mt-3 
         text-center leading-5    {/*mobile first*/}
      md:text-[1rem]   md:w-130    {/*tablet_screen */}
      lg:text-[1.2rem] lg:w-200     {/*larg screen*/}
        "
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export default Content;
