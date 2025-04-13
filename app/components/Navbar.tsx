import React from 'react';
import Logo from './Logo';

const Navbar = () => {
  return (
    <header className='flex h-[59px] w-full shrink-0 items-center justify-between pr-7 pl-7 md:px-15 md:h-[72px]'>
      <Logo />
      <nav>
        <ul className='flex items-center justify-end gap-9'>
          <li>
            {' '}
            <img src='/info.svg' className='h-[34px] w-[34px]' />
          </li>
          <li>
            {' '}
            <img src='/log-in.svg' className='h-[34px] w-[34px]' />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
