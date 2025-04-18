'use client';
import { signWithGoogle } from '@/utils/supabase/authentications';
import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Container from '@/app/components/Container';
import Logo from '@/app/components/Logo';

const LoginPage = () => {
  return (
    <Container className='bg-neutral-800'>
      <main className='flex min-h-screen w-full flex-col items-center justify-center px-4'>
        <div className='flex w-full max-w-[519px] flex-col items-center gap-8'>
          <Logo />

          <section className='bg-radial-gradient flex w-full flex-col gap-[18px] rounded-[12px] px-8 py-4 shadow-md md:w-[488px] md:py-5 lg:w-[590px]'>
            <header className='flex flex-col gap-2 text-center'>
              <h1 className='lead leading-7'>Login</h1>
              <p className='small'>Use your UP email to get started.</p>
            </header>

            <button
              type='button'
              onClick={signWithGoogle}
              className='bg-secondary-900 small hover:bg-secondary-500 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition'
              aria-label='Login with Google'
            >
              <Mail className='size-5' />
              Login with Google
            </button>
          </section>

          <footer className='subtle mt-[-26px] text-center text-sm'>
            Having trouble?{' '}
            <Link href='#' className='text-secondary-900 hover:underline'>
              Contact Support
            </Link>
          </footer>
        </div>
      </main>
    </Container>
  );
};

export default LoginPage;
