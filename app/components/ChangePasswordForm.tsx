'use client';

import { useState } from 'react';
import { updatePassword } from '@/utils/supabase/authentications';
import Container from './Container';
import { X, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword({ onClose }: { onClose?: () => void }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'error' | 'success' | ''>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Track validation errors
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  // Add a loading state
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = (formData: FormData) => {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    if (!currentPassword) {
      setCurrentPasswordError('Current password is required.');
    }

    if (newPassword !== confirmPassword) {
      setNewPasswordError('Passwords do not match.');
      setConfirmPasswordError('Passwords do not match.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Local validation
    validatePasswords(formData);
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      return;
    }

    setIsLoading(true);

    const result = await updatePassword(formData);
    if (result?.error) {
      setMessage(result.error);
      setStatus('error');
      if (result.error.includes('Current password')) {
        setCurrentPasswordError(result.error);
      }
    } else {
      setMessage(result.success || 'Password updated');
      setStatus('success');
      setCurrentPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);
      setTimeout(() => {
        if (onClose) onClose();
        setMessage('');
        setStatus('');
      }, 1500);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <div className='bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/60 px-7 py-[10px]'>
        <div className='relative flex w-full max-w-[519px] min-w-[320px] flex-col gap-6 rounded-md bg-white p-[25px] shadow-lg'>
          <div className='flex flex-col gap-3'>
            <button
              onClick={onClose}
              className='self-end text-black'
              aria-label='Close modal'
            >
              <X className='size-4 cursor-pointer' />
            </button>
            <header className='space-y-1'>
              <div className='lead text-neutral-900'>
                Account Change Password
              </div>
              <p className='text-neutral-400'>
                Make changes to your password here. Type your new password,
                confirm it, and click change password when youre done.
              </p>
            </header>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              {/* Current Password */}
              <div className='space-y-1.5'>
                <label
                  htmlFor='currentPassword'
                  className='medium block text-neutral-900'
                >
                  Current Password
                </label>
                <div className='relative'>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    className={`w-full border px-3 py-2 ${currentPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} subtle rounded-md text-black outline-neutral-500`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-neutral-900'
                    aria-label='Toggle password visibility'
                  >
                    {showCurrentPassword ? (
                      <Eye className='size-4' />
                    ) : (
                      <EyeOff className='size-4' />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className='space-y-1.5'>
                <label
                  htmlFor='newPassword'
                  className='medium block text-neutral-900'
                >
                  New Password
                </label>
                <div className='relative'>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    className={`w-full border px-3 py-2 ${newPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} subtle rounded-md text-black outline-neutral-500`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-neutral-900'
                  >
                    {showNewPassword ? (
                      <Eye className='size-4' />
                    ) : (
                      <EyeOff className='size-4' />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className='space-y-1.5'>
                <label
                  htmlFor='confirmPassword'
                  className='medium block text-neutral-900'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`w-full border px-3 py-2 ${confirmPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} subtle rounded-md text-black outline-neutral-500`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-neutral-900'
                  >
                    {showConfirmPassword ? (
                      <Eye className='size-4' />
                    ) : (
                      <EyeOff className='size-4' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <p
                className={`${status === 'error' ? 'text-red-500' : 'text-sm text-green-600'}`}
              >
                {message}
              </p>
            )}

            <button
              type='submit'
              className='bg-primary-900 small hover:bg-primary-700 ml-auto w-[151px] cursor-pointer rounded-md px-4 py-2 text-white duration-200 ease-in-out'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
