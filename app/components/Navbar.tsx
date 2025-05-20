'use client';

import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/utils/supabase/authentications';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type NavbarProps = {
  variant: 'home' | 'facility';
};

const Navbar = ({ variant }: NavbarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };

    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdminPath =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin');
  const isAdminUser = isAdminPath && user;

  const getInitials = () => {
    if (!user) return '?';
    if (isAdminUser) return 'A';

    const metadata = user.user_metadata as { full_name?: string };
    const fullName = metadata.full_name || user.email || '';
    return fullName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (variant === 'home') {
    return (
      <header className='relative flex h-[72px] w-full shrink-0 items-center px-7 md:px-15'>
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
      </header>
    );
  }

  // Facility Navbar (Authenticated/Admin)
  return (
    <header className='relative flex h-[72px] w-full shrink-0 items-center px-7 md:px-15'>
      <nav className='flex w-full items-center justify-between'>
        <button
          aria-label='Sidebar toggle'
          className='hover:bg-primary-50 flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 duration-200 ease-in-out focus:outline-none'
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className='size-8 text-black' />
        </button>

        <div className='flex items-center justify-center'>
          <Logo variant='icon' />
        </div>

        <div ref={dropdownRef} className='relative'>
          <button
            id='user-menu-button'
            aria-haspopup='true'
            aria-expanded={dropdownOpen}
            aria-controls='user-dropdown'
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='hover:bg-primary-50 relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-base font-normal focus:ring-2 focus:ring-neutral-400 focus:outline-none'
            style={{ fontFamily: 'var(--font-schibsted)' }}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                isAdminUser ? 'bg-primary-900' : 'bg-secondary-900'
              }`}
            >
              {getInitials()}
            </div>
          </button>

          {dropdownOpen && (
            <section
              id='user-dropdown'
              role='menu'
              aria-labelledby='user-menu-button'
              className='absolute top-14 right-0 z-50 w-56 rounded-md border border-neutral-900 bg-white text-sm shadow-lg focus:outline-none'
            >
              <header className='flex h-[72px] items-center justify-between gap-[10px] px-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-normal text-white ${
                      isAdminUser ? 'bg-primary-900' : 'bg-secondary-900'
                    }`}
                    style={{ fontFamily: 'var(--font-schibsted)' }}
                  >
                    {getInitials()}
                  </div>
                  <div className='flex flex-col'>
                    <span className='small text-neutral-800'>
                      {isAdminUser
                        ? user?.email?.split('@')[0]
                        : (user?.user_metadata as { full_name?: string })
                            ?.full_name || user?.email}
                    </span>
                    {isAdminUser && (
                      <span className='subtle text-neutral-900'>Admin</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDropdownOpen(false)}
                  aria-label='Close menu'
                  className='rounded p-1 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none'
                ></button>
              </header>

              <hr className='absolute left-0 w-full border-black' />

              <ul className='px-3 py-2' role='none'>
                <li role='menuitem'>
                  <button
                    onClick={logout}
                    className='small hover:bg-primary-50 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-[6px] text-left text-red-600 duration-200 ease-in-out focus:outline-none'
                  >
                    <LogOut className='size-4' />
                    Log out
                  </button>
                </li>
              </ul>
            </section>
          )}
        </div>
      </nav>

      <hr className='absolute left-0 mt-[72px] w-full border-b border-neutral-400' />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
};

export default Navbar;
