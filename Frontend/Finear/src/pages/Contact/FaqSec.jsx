import React from 'react'
import FAQbar from './FAQbar'

function Faqs() {
    const faqs = [
    {
      question: "What Is Finear?",
      answer: "Finear is a simple personal finance app that helps you track income, expenses, and savings in one place."
    },
    {
      question: "Is Finear free to use?",
      answer: "Yes, Finear is free to use for personal money tracking."
    },
    {
      question: "Do I need to connect my bank account?",
      answer: "No, you can use Finear without linking any bank account."
    },
    {
      question: "Is my financial data safe?",
      answer: "Yes, your data is stored securely and your privacy is always protected."
    },
    {
      question: "Can I track my monthly budget and expenses?",
      answer: "Yes, Finear lets you track income, expenses, and savings month by month."
    },
    {
      question: "Does Finear work on mobile devices?",
      answer: "Yes, Finear works smoothly on mobile, tablet, and desktop screens."
    },
    {
      question: "Can I edit or delete my records later?",
      answer: "Yes, you can easily edit or remove your income and expense records anytime."
    },
];
  return (
    <div className='flex flex-col gap-15
    md:flex-row md:items-center md:justify-around
    
    '>
            <div
        className=" mx-5 
        content text-center 
        text-primary flex flex-col gap-2
        md:text-left 
        lg:text-5xl lg:gap-5 
        "
      >
        <h2
          className="
font-semibold text-4xl mt-10
" 
        >
          Frequently Asked
Questions   
        </h2>
        <p
          className="
           text-gray-400 mt-2
          text-sm
          lg:text-base
          "
        >
          Everything you need to know about our platform in one place.
        </p>
      </div>
      <div className='mx-5 max-w-lg'>
        {
            faqs.map((faq, index)=>(
                <FAQbar key={index} question={faq.question} answer={faq.answer}/>
            )

            )
        }

      </div>
    </div>
  )
}

export default Faqs
{/*
          <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQbar key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
     */}