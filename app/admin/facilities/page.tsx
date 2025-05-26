import { Metadata } from 'next';
import CreateFacilityPage from '@/app/components/AdminFacilities';

export const metadata: Metadata = {
  title: 'Facilities',
};

export default function AdminFacilitiesPage() {
  return <CreateFacilityPage />;
}
