'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Building2, Calendar, Users } from 'lucide-react';
import ChangePassword from '@/app/components/ChangePasswordForm';
import { readFacilities } from '@/utils/supabase/facility';
import { countSchedule } from '@/utils/supabase/schedule';

function DashboardContent() {
  const [facilitiesCount, setFacilitiesCount] = useState<number | undefined>();
  const [schedulesCount, setSchedulesCount] = useState<number | undefined>();
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);

    async function fetchCounts() {
      try {
        const facilities = await readFacilities();
        setFacilitiesCount(facilities.length);
      } catch {
        setFacilitiesCount(undefined);
      }

      try {
        const count = await countSchedule();
        setSchedulesCount(count ?? 0);
      } catch {
        setSchedulesCount(undefined);
      }
    }

    fetchCounts();
  }, []);

  useEffect(() => {
    if (searchParams.get('modal') === 'changePassword') {
      setTimeout(() => {
        setShowChangePassword(true);
      }, 500);
      window.history.replaceState({}, '', '/admin');
    }
  }, [searchParams]);

  return (
    <main className='min-h-screen bg-neutral-50'>
      <Navbar variant='facility' />
      <Container className='w-full px-2 sm:px-4'>
        <section className='mb-8'>
          <h1 className='text-primary-900 h1'>Dashboard</h1>
        </section>
        <section>
          <div className='mb-8'>
            <Card className='overflow-hidden'>
              <div className='grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
                <div className='flex flex-col items-center justify-center p-4 text-center'>
                  <Building2 className='text-secondary-900 h-8 w-8' />
                  <h2 className='text-primary-900 text-2xl font-bold'>
                    {isMounted ? (facilitiesCount ?? 0) : 'Loading...'}
                  </h2>
                  <p className='lead text-neutral-900'>Facilities</p>
                </div>
                <div className='flex flex-col items-center justify-center p-4 text-center'>
                  <Calendar className='text-secondary-900 h-8 w-8' />
                  <h2 className='text-primary-900 text-2xl font-bold'>
                    {isMounted ? (schedulesCount ?? 0) : 'Loading...'}
                  </h2>
                  <p className='lead text-neutral-900'>Events</p>
                </div>
                <div className='flex flex-col items-center justify-center p-4 text-center'>
                  <Users className='text-secondary-900 h-8 w-8' />
                  <h2 className='text-primary-900 text-2xl font-bold'>1</h2>
                  <p className='lead text-neutral-900'>Admins</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
        <section>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
            <Card className='flex h-full flex-col'>
              <CardHeader>
                <CardTitle className='lead text-neutral-900'>
                  Management
                </CardTitle>
                <CardDescription>
                  <p className='small text-neutral-400'>
                    Manage your facilities, events, and admins from here.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className='mt-auto'>
                <Button
                  variant='default'
                  className='bg-primary-900 hover:bg-primary-700 small w-full cursor-pointer duration-200 ease-in-out'
                  onClick={() => router.push('/admin/facilities')}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
            <Card className='flex h-full flex-col'>
              <CardHeader>
                <CardTitle className='lead text-neutral-900'>
                  Password
                </CardTitle>
                <CardDescription>
                  <p className='small text-neutral-400'>
                    Update your password regularly to keep your account secure.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className='mt-auto'>
                <Button
                  variant='default'
                  className='bg-primary-900 hover:bg-primary-700 small w-full cursor-pointer duration-200 ease-in-out'
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
          {showChangePassword && (
            <div className='bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center'>
              <button
                className='absolute top-4 right-4 z-10 bg-transparent text-2xl text-gray-500 hover:text-gray-700'
                onClick={() => setShowChangePassword(false)}
                aria-label='Close'
              >
                ×
              </button>
              <ChangePassword onClose={() => setShowChangePassword(false)} />
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
