'use client';

import { useState } from 'react';
import { logout, updatePassword } from '@/utils/supabase/authentications';
import Container from './Container';
import { X, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'error' | 'success' | ''>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Track validation errors
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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

    setIsLoading(true); // Set loading to true when password update starts

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
        setIsModalOpen(false);
        setMessage('');
        setStatus('');
      }, 1500);
    }
    setIsLoading(false); 
  };

  return (
    <>
      <div className="flex gap-4 mt-4">
        <form action={logout}>
          <button type="submit" className="bg-red-600 rounded px-4 py-2">
            Logout
          </button>
        </form>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 rounded px-4 py-2"
        >
          Change Password
        </button>
      </div>

      {isModalOpen && (
        <Container>
          <div className="fixed inset-0 z-50 bg-neutral-800/60 flex items-center justify-center px-7 py-[10px]">
            <div className="relative bg-neutral-200 min-w-[320px] max-w-[519px] w-full rounded-md shadow-lg p-[25px] flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="self-end text-black"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
                <header className="space-y-1">
                  <h2 className="large leading-7 text-black">
                    Account Change Password
                  </h2>
                  <p className="subtle text-sm text-neutral-500">
                    Make changes to your password here. Type your new password, confirm it, and click change password when you're done.
                  </p>
                </header>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">

                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="currentPassword" className="block medium text-black">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        className={`w-full px-3 py-2 border ${currentPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} rounded-md outline-neutral-500 subtle text-black`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                        aria-label="Toggle password visibility"
                      >
                        {showCurrentPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="newPassword" className="block medium text-black">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        className={`w-full px-3 py-2 border ${newPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} rounded-md outline-neutral-500 subtle text-black`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                      >
                        {showNewPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block medium text-black">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className={`w-full px-3 py-2 border ${confirmPasswordError ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-black'} rounded-md outline-neutral-500 subtle text-black`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                      >
                        {showConfirmPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {message && <p className={`${status === 'error' ? 'text-red-500' : 'text-green-600 text-sm'}`}>{message}</p>}

                <button
                  type="submit"
                  className="ml-auto w-[151px] px-4 py-2 bg-primary-900 small rounded-md hover:bg-primary-700"
                  disabled={isLoading} 
                >
                  {isLoading ? 'Loading...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
