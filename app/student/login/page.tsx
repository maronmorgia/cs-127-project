'use client';

import React, { useState } from 'react';
import { signWithGoogle } from '@/utils/supabase/authentications';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Container from '@/app/components/Container';
import Logo from '@/app/components/Logo';
import ToastNotification from '@/app/components/Toast';

const LoginPage = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await signWithGoogle();
      setToast({ message: 'Login Successful!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Login Failed! Please try again.', type: 'error' });
    }
  };

  return (
    <Container className='flex min-h-screen items-center justify-center bg-neutral-800'>
      <main className='flex w-full max-w-[519px] flex-col items-center gap-8'>
        <div className='flex w-full max-w-[519px] flex-col items-center gap-8'>
          <Logo />

          <section className='bg-radial-gradient flex w-full flex-col gap-[18px] rounded-[12px] px-8 py-4 shadow-md md:w-[519px] md:py-5 lg:w-[590px]'>
            <header className='flex flex-col gap-2 text-center'>
              <h1 className='lead leading-7'>Login</h1>
              <p className='small'>Use your UP email to get started.</p>
            </header>

            <button
              type='button'
              onClick={handleGoogleLogin}
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

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
};

export default LoginPage;
