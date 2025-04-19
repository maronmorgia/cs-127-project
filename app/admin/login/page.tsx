import { login } from '@/utils/supabase/authentications';
import Container from '@/app/components/Container';
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <Container className="bg-neutral-800 min-h-screen flex items-center justify-center">
      <form className="bg-gradient-orange w-full max-w-[519px] md:w-[520px] px-8 py-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-[20px]">
        <h1 className="lead text-center leading-7">WELCOME SUPERUSER</h1>

        <div className="flex flex-col gap-4">
          {/* Email */}
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

          {/* Password */}
          <div className="relative flex items-center w-full bg-neutral-50 text-sm text-black rounded-md border-2 border-neutral-800 overflow-hidden">
            <div className="pl-3 flex items-center">
              <Lock className="size-[18px] text-neutral-800" />
            </div>
            <div className="absolute left-[42px] h-full w-[2px] bg-neutral-800" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="subtle w-full pl-5 pr-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="small bg-primary-900 rounded-md px-4 py-2 hover:bg-primary-700 transition"
          formAction={login}
        >
          Log in
        </button>
      </form>
    </Container>
  );
}
