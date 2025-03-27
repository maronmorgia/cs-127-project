import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { logout } from './login/actions'; // adjust the path as needed

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
        <p>waa</p>
        <a href='/login'>
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
      <form action={logout}>
        <button type='submit'>Logout</button>
      </form>
    </>
  );
}
