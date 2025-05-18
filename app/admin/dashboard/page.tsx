'use client';

import '@/app/globals.css';
import { useEffect, useState } from 'react';
import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Calendar,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { readFacilities } from '@/utils/supabase/facility';
// import { readScheduledEvents } from '@/utils/supabase/schedule'; // Commented out
// import { readAdmins } from '@/utils/supabase/admin'; // Commented out

export default function DashboardPage() {
  const [facilitiesCount, setFacilitiesCount] = useState<number | undefined>();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    async function fetchFacilitiesCount() {
      try {
        const facilities = await readFacilities();
        setFacilitiesCount(facilities.length);
      } catch {
        setFacilitiesCount(undefined);
      }
    }
    fetchFacilitiesCount();
  }, []);

  return (
    <main>
      <Navbar variant='facility' />
      <Container>
        <section className='mb-8 inline-flex flex-col items-start justify-start self-stretch'>
          <h1 className='text-primary-900 h1 justify-start'>Dashboard</h1>
        </section>
        <section>
          <div className='flex justify-center'>
            <div className='grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Card className='flex flex-1 flex-col'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='lead text-neutral-900'>
                    Facility
                  </CardTitle>
                  <Building2 className='text-secondary-900 relative h-6 w-6' />
                </CardHeader>
                <CardContent>
                  <h2 className='text-neutral-900'>
                    {hasMounted && facilitiesCount !== undefined
                      ? `${facilitiesCount} Facilities`
                      : 'Loading...'}
                  </h2>
                </CardContent>
                {/* Comment out or keep placeholders for Schedule and Administrators */}
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='lead text-neutral-900'>
                    Schedule
                  </CardTitle>
                  <Calendar className='text-secondary-900 relative h-6 w-6' />
                </CardHeader>
                <CardContent>
                  <h2 className='text-neutral-900'>Loading...</h2>
                </CardContent>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='lead text-neutral-900'>
                    Administrators
                  </CardTitle>
                  <Users className='text-secondary-900 relative h-6 w-6' />
                </CardHeader>
                <CardContent>
                  <h2 className='text-neutral-900'>Loading...</h2>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
