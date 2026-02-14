
import React, { useState } from 'react'
import { Get_Button } from './Buttons'
import { Menu, X } from 'lucide-react' // Icons ke liye
import { Link, useNavigate } from 'react-router-dom';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
const navigate= useNavigate();
const gotoHome=()=>{
  navigate('/')
}

  return (
    <nav className='relative pt-5'>
      {/* Main Navbar Container */}
      <div className='flex justify-between items-center py-4 px-2 md:px-0'>
        
        {/* 1. Logo */}
        <img src="/logo.svg" alt="Finear Logo" className="w-32 md:w-40" onClick={gotoHome} />

        {/* 2. Desktop Navigation (lg screens se upar dikhegi) */}
        <div className='hidden lg:flex rounded-full w-fit px-8 py-2 justify-center items-center shadow-[0px_0px_20px_5px_rgba(108,138,255,0.1)] border border-gray-100 '>
          <ul className='flex gap-10 lg:gap-16'>
            <Link className='font-medium cursor-pointer hover:text-secondary transition' to='/'>Home</Link>
            <Link className='font-medium cursor-pointer hover:text-secondary transition' to='/dashboard'>Dashboard</Link>
            <Link className='font-medium cursor-pointer hover:text-secondary transition' to='/about-us'>About us</Link>
            <Link className='font-medium cursor-pointer hover:text-secondary transition' to='/contact-us'>Contact us</Link>
          </ul>
        </div>

        {/* 3. Desktop Button & Mobile Toggle Container */}
        <div className='flex items-center gap-4'>
          {/* Button desktop par dikhega, mobile par chota ho jayega ya chhup jayega */}
          <div className='hidden sm:block'>
            <Get_Button />
          </div>

          {/* Hamburger Icon (Sirf mobile par dikhega) */}
          <button 
            className='lg:hidden p-2 text-primary'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Overlay (Jab isOpen true ho) */}
      {isOpen && (
        <div className='absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl p-6 mt-2 z-50 md:hidden flex flex-col items-center gap-6 border border-gray-100'>
          <ul className='flex flex-col items-center gap-6 w-full'>
            <Link className='font-medium text-lg border-b w-full text-center pb-2' to='/'>Home</Link>
            <Link className='font-medium text-lg border-b w-full text-center pb-2' to='/dashboard'>Dashboard</Link>
            <Link className='font-medium text-lg border-b w-full text-center pb-2' to='/about-us'>About us</Link>
            <Link className='font-medium text-lg border-b w-full text-center pb-2' to='/contact-us'>Contact us</Link>
          </ul>
          <div className='sm:hidden block w-full'>
            <Get_Button className="w-full" /> {/* Mobile par full width button */}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar;



// import React from 'react'
// import { Get_Button } from './Buttons'

// function Navbar() {
//   return (
  
//     <div className='flex justify-between items-center'>
//       <img  src="../src/assets/logo.svg" alt="" />
//       <div className='flex rounded-full w-xl p-2 justify-center items-center shadow-[0px_0px_20px_5px_rgba(108,138,255,0.2)]'>
//         <ul className='flex gap-16'>
//         <li className=' font-medium'>Home</li>
//         <li className=' font-medium'>Dashboard</li>
//         <li className=' font-medium'>About us</li>
//         <li className=' font-medium'>Contact us </li>
//         </ul>
//         </div>
//         <Get_Button/>

//     </div>
//   )
// }

// export default Navbar
