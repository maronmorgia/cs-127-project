import { Metadata } from 'next';
import AdminDashboard from '@/app/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
