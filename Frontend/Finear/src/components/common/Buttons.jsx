import React from 'react'
import { useNavigate } from 'react-router-dom';

export function Get_Button() {
    const navigate = useNavigate();
  const goToLogin = () => {
    
    navigate('/auth/login'); 
  };


  return (
    <div>
      <button className="bg-navy-gradient -500 rounded-full w-50 h-12 font-dmsans text-white 
      cursor-pointer
      hover:bg-bule-gradient  
      hover:border
      hover: border-white 
      hover:shadow-[0px_0px_15px_rgba(4,61,183,0.15)] "
      onClick={goToLogin}
      >Login</button>
    </div>
  )
}
export function Start_Button({colorClass="bg-bule-gradient",textClass="text-white",heading="Start with Finear"}) {
      const navigate = useNavigate();
  return (
    <div>
      <button className={`${colorClass} rounded-full w-52 h-12 font-dmsans ${textClass} font-medium cursor-pointer hover:border
      hover: border-white 
      hover:shadow-[0px_0px_15px_rgba(4,61,183,0.15)]`}
      onClick={()=>navigate('/auth/signup')}
      >{heading}</button>
    </div>
  )
}


