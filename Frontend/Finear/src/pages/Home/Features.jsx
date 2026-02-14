import React from "react";
import FeatureCard from "./components/FeatureCard";
import Content from "../../components/common/Content";

function Features() {
  return (
    <>
      <div className="main w-full bg-white pb-10 pt-10 flex flex-col justify-center pl-5 pr-5 items-center">
        <div
          className="content 
        "
        >
          <Content
            heading1="Your"
            middelTaxt="Finear"
            headin2="Starts Here"
            body="Everything you need to manage your money, built to be simple, clear, and easy to use."
          />
        </div>
        <div
          className=" 
        flex flex-col mt-5 gap-5 
        md:flex-row
        lg:w-[70%] lg:m-auto lg:mt-10

         "
        >
          <FeatureCard
            img="/grph.svg"
            heading="Real-Time Financial Dashboards"
            body="See your income, expenses, and balance update instantly, so you always know your financial position."
          />
          <FeatureCard
            img="/map.svg"
            heading="Smart Spending Insights"
            body="Understand where your money goes with clear insights that help you control spending and save more."
          />
        </div>
      </div>
    </>
  );
}

export default Features;
