import React from "react";
import Content from "../../components/common/Content";
import Steps from "./components/Steps";

function HowItWorks() {
  return (
    <>
      <div className="main w-full pt-10 pb-10 pl-5 pr-5 relative  flex flex-col items-center justify-center overflow-hidden">
        <img
          className=" 
      hidden absolute opacity-10 translate-y-20 max-w-full
      sm:block"
          src="/flow.png"
          alt="img"
        />
        <div className="content ">
          <Content
            heading1="How"
            middelTaxt="Finear"
            headin2="Works"
            body="Get started in three simple steps."
          />
        </div>
        <div
          className="flex flex-wrap gap-15 relative justify-center mt-10  
md:flex-nowrap
lg:gap-30 
xl:gap-40 xl:mt-48
"
        >
          <Steps
            number="1"
            heading="Connect Your Accounts"
            body="Link your financial accounts securely to bring all your data into Finear."
            align="center"
          />
          <Steps
            number="2"
            heading="Connect Your Accounts"
            body="Link your financial accounts securely to bring all your data into Finear."
            align="center"
          />
          <Steps
            number="3"
            heading="Connect Your Accounts"
            body="Link your financial accounts securely to bring all your data into Finear."
            align="center"
          />
        </div>
      </div>
    </>
  );
}

export default HowItWorks;
