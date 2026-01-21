import React from 'react'
import {Outlet} from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

function MainLayout() {
  return (
      <div className="parent bg-back-ground w-full h-auto font-dmsans">
        <div className="mx-5">
          <Navbar/>
        </div>
        {/* Outlet wo jagah hai jahan home, about wagera render honge */}
<main>
    <Outlet/>
</main>
        <div>
          <Footer/>
        </div>
      </div>
  )
}

export default MainLayout;
