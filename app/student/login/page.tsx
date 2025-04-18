'use client';
import { signWithGoogle } from '@/utils/supabase/authentications';
import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const LoginPage = () => {
  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center px-4'>
      <section
        aria-label='Login form section'
        className='custom-radial-bg flex w-[319px] flex-col gap-6 rounded-[12px] px-8 py-6 shadow-md md:w-[488px] lg:w-[590px]'
      >
        <header className='flex flex-col gap-2 text-center'>
          <h1 className='lead'>Login</h1>
          <p className='small text-muted'>Use your UP email to get started.</p>
        </header>

        <button
          type='button'
          onClick={signWithGoogle}
          className='bg-secondary-900 small flex items-center justify-center gap-2 rounded-md px-4 py-2 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-secondary-700'
          aria-label='Login with Google'
        >
          <Mail className='size-5' />
          Login with Google
        </button>
      </section>

      <footer className='mt-4 text-center text-sm text-gray-400'>
        Having trouble?{' '}
        <Link href='#' className='text-secondary-900 hover:underline'>
          Contact Support
        </Link>
      </footer>
    </main>
  );
};

export default LoginPage;
