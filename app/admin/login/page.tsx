'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { loginAction } from '@/utils/supabase/authentications';
import Container from '@/app/components/Container';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(loginAction, { error: '' });

  return (
    <Container className="bg-neutral-800 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-[519px] md:w-[520px]">
        <form
          action={formAction}
          className="bg-gradient-orange w-full px-8 py-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-[20px]"
        >
          <h1 className="lead text-center leading-7">WELCOME SUPERUSER</h1>

          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="relative flex items-center w-full bg-neutral-50 text-sm text-black rounded-md border-2 border-neutral-800 overflow-hidden">
              <div className="pl-3 flex items-center">
                <User className="size-[18px] text-neutral-800" />
              </div>
              <div className="absolute left-[42px] h-full w-[2px] bg-neutral-800" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className="subtle w-full pl-5 pr-3 py-2 focus:outline-none"
              />
            </div>

            {/* Password Field with toggle */}
            <div className="relative flex items-center w-full bg-neutral-50 text-sm text-black rounded-md border-2 border-neutral-800 overflow-hidden">
              <div className="pl-3 flex items-center">
                <Lock className="size-[18px] text-neutral-800" />
              </div>
              <div className="absolute left-[42px] h-full w-[2px] bg-neutral-800" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="subtle w-full pl-5 pr-10 py-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-800"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="small bg-primary-900 rounded-md px-4 py-2 hover:bg-primary-700 transition"
          >
            Log in
          </button>
        </form>

        {/* Error Message */}
        {state?.error && (
          <div className="w-full pt-10 flex justify-center">
            <p className="bg-red-700 text-white rounded-lg small p-2 text-center shadow-lg border-2 border-red-700">
              {state.error}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
