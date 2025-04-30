'use client';

import React, { useState } from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin/facilities');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className='relative flex h-[72px] w-full shrink-0 items-center px-7 md:px-15'>
      {isAdmin ? (
        <>
          {/* Admin Navbar */}
          <nav className='flex w-full items-center justify-between'>
            <button
              aria-label='Sidebar toggle'
              className='flex items-center justify-center gap-2 rounded-md p-2'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className='size-8 text-black' />
            </button>

            <div className='flex items-center justify-center'>
              <Logo variant='icon' />
            </div>

            <div
              aria-label='User avatar'
              className='inline-flex h-[72px] flex-col items-center justify-center overflow-hidden rounded-md'
            >
              <div className='relative h-10 w-10' data-type='avatar initials'>
                <div className='absolute h-10 w-10 rounded-full bg-[#294936]'></div>
              </div>
            </div>
          </nav>
          <hr className='absolute left-0 mt-[72px] w-full border-b border-neutral-400'></hr>

          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      ) : (
        // Student/Faculty Navbar
        <nav className='flex w-full items-center justify-between'>
          <Logo variant='full' />
          <ul className='flex items-center justify-end gap-8'>
            <li>
              <Link href='#'>
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
              <Link href='/student/login'>
                <img
                  src='/log-in.svg'
                  alt='Log-in icon'
                  className='block h-[34px] w-[34px] cursor-pointer lg:hidden'
                />
                <button className='hover:bg-secondary-500 bg-secondary-900 lead hidden h-14 w-[146px] cursor-pointer items-center justify-center rounded-md px-4 py-2 leading-7 text-neutral-50 transition-all duration-300 hover:w-[154px] hover:underline lg:flex'>
                  Log in
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
