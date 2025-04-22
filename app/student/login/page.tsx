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

  // Add a loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true); // Set loading to true when login starts
      await signWithGoogle(); // Trigger google sign in process
      setToast({ message: 'Login Successful!', type: 'success' });
      // Spinner will not stop since the redirect will stop it after successfull login
    } catch (error) {
      console.error('Login failed:', error);
      setToast({ message: 'Login Failed! Please try again.', type: 'error' });
      setIsLoading(false); // Stop the spinner immediately on failure for user to try again
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
              disabled={isLoading}
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

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Full-screen loading overlay */}
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/60'>
          <div className='border-secondary-700 h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-t-transparent'></div>
        </div>
      )}
    </Container>
  );
};

export default LoginPage;
