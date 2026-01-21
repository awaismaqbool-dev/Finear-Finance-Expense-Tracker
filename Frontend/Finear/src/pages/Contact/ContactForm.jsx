import React from "react";

function ContactForm() {
  return (
    <div
      className="
      w-full text-primary
      max-w-sm
      lg:max-w-md
      xl:max-w-lg
      lg:py-10
      my-8
     rounded-2xl
    bg-back-ground p-6
    flex flex-col gap-6
    "
    >
      <div className="text-center pr-5 pl-5">
        <h1 className="text-2xl font-medium">Send a Message</h1>
        <p className="text-[0.6em]">
          Fill out the form below and we’ll get back to you soon.
        </p>
      </div>
      <form
        action="#"
        className="
         flex 
        flex-col justify-between gap-5
        lg:gap-8
        
        "
      >
        <div>
          <label htmlFor="UserName">First Name</label>
          <input
            type="text"
            id="UserName"
            className="
          border border-gray-400  
          w-full rounded-md px-3
          py-2 text-sm
          "
            placeholder="Enter Your Full Name"
          />
        </div>
        <div>
          <label htmlFor="UserEmail">Email Address</label>
          <input
            type="Email"
            id="UserEmail"
            className="
          border border-gray-400  
          w-full rounded-md px-3
          py-2 text-sm
          "
            placeholder="Enter Your Email"
          />
        </div>
        <div>
          <label htmlFor="UserName">Message</label>
          <textarea
            name="message"
            id="message"
            className="
          border border-gray-400  
          w-full rounded-md
          px-3 py-2 text-sm 
          min-h-25
      "
            placeholder="Enter Your Email"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full h-8 bg-bule-gradient text-white rounded-2xl text-[0.8rem]"
        >
          Contact US
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
