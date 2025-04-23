'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/utils/supabase/authentications';
import Container from '@/app/components/Container';
import ToastNotification from '@/app/components/Toast';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const router = useRouter();

  const formAction = useActionState(
    async (prevState: { error: string }, formData: FormData) => {
      setIsLoading(true);
      const result = await loginAction(prevState, formData);

      if (result?.error) {
        setToast({
          message:
            result.error === 'Incorrect email or password'
              ? 'Incorrect email or password.'
              : 'Login failed. Please try again later.',
          type: 'error',
        });
        setIsLoading(false);
        return { error: '' }; // Clear form-level error
      } else {
        setToast({ message: 'Login Successful!', type: 'success' });

        // Delay redirection so "Loading..." remains visible
        setTimeout(() => {
          router.push('/admin/');
        }, 1000);
        return { error: '' };
      }
    },
    { error: '' }
  )[1];

  return (
    <Container className='flex min-h-screen items-center justify-center bg-neutral-800'>
      <div className='flex w-full max-w-[519px] flex-col items-center md:w-[520px]'>
        <form
          action={formAction}
          className='bg-gradient-orange flex w-full flex-col gap-[20px] rounded-xl px-8 py-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'
        >
          <h1 className='lead text-center leading-7'>WELCOME SUPERUSER</h1>

          <div className='flex flex-col gap-4'>
            {/* Email Field */}
            <div className='relative flex w-full items-center overflow-hidden rounded-md border-2 border-neutral-800 bg-neutral-50 text-sm text-black'>
              <div className='flex items-center pl-3'>
                <User className='size-[18px] text-neutral-800' />
              </div>
              <div className='absolute left-[42px] h-full w-[2px] bg-neutral-800' />
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                required
                className='subtle w-full py-2 pr-3 pl-5 focus:outline-none'
              />
            </div>

            {/* Password Field */}
            <div className='relative flex w-full items-center overflow-hidden rounded-md border-2 border-neutral-800 bg-neutral-50 text-sm text-black'>
              <div className='flex items-center pl-3'>
                <Lock className='size-[18px] text-neutral-800' />
              </div>
              <div className='absolute left-[42px] h-full w-[2px] bg-neutral-800' />
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                required
                className='subtle w-full py-2 pr-10 pl-5 focus:outline-none'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-neutral-800'
                aria-label='Toggle password visibility'
              >
                {showPassword ? (
                  <Eye className='size-4' />
                ) : (
                  <EyeOff className='size-4' />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='small bg-primary-900 hover:bg-primary-700 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition'
          >
            {isLoading ? 'Loading...' : 'Log in'}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
}
