<<<<<<< HEAD
import React from 'react';
import Logo from './Logo';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className='flex h-[59px] w-full shrink-0 items-center justify-between pr-7 pl-7 md:h-[72px] md:px-15'>
      <Logo />
      <nav>
        <ul className='flex items-center justify-end gap-8'>
          <li>
            <Link href=''>
              <img
                src='/info.svg'
                alt='Info icon'
                className='block h-[34px] w-[34px] cursor-pointer lg:hidden'
              />
              <button className='lead hidden h-10 cursor-pointer items-center justify-center rounded-md px-4 py-2 leading-7 text-neutral-50 lg:flex'>
                Learn more
              </button>
            </Link>
          </li>

          <li>
            <img
              src='/log-in.svg'
              alt='Log-in icon'
              className='block h-[34px] w-[34px] cursor-pointer lg:hidden'
            />
            <button className='hover:bg-secondary-500 bg-secondary-900 lead hidden h-14 w-[146px] cursor-pointer items-center justify-center rounded-md px-4 py-2 leading-7 text-neutral-50 transition-all duration-300 hover:w-[154px] hover:underline lg:flex'>
              Log in
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
=======
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
>>>>>>> 83fbc73 (feat: add components folder with Navbar and Logo components, include local SVG assets)
