import React from 'react'
import Logo from './Logo';

const Navbar = () => {
  return (
    <header className="flex w-full h-[59px] justify-between items-center shrink-0">
    <Logo />
    <nav>
      <ul className="flex justify-end items-center gap-9">
       <li> <img src='/info.svg' className="w-[34px] h-[34px]"/></li>
       <li> <img src='/log-in.svg' className='w-[34px] h-[34px'/></li>
      </ul>
    </nav>
  </header>
  )
}

export default Navbar