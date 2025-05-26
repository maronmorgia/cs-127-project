import LoginPage from '@/app/components/AdminLoginPage';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to the admin dashboard',
};

export default function Page() {
  return <LoginPage />;
}
