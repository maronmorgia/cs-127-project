import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ChangePassword from '../components/ChangePasswordForm';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/error');
  }

  const userRole = data.user.user_metadata?.role;

  if (userRole !== 'superuser') {
    return (
      <>
        <p>Not superuser, Not authenticated</p>
        <a href='/student/login'>
          <button>Go to Login</button>
        </a>
      </>
    );
  }

  return (
    <>
      <p>
        Hello {data.user.email}, Role: {userRole}
      </p>
      <ChangePassword />
    </>
  );
}
