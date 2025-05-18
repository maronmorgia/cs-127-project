'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Building2, Calendar, Users } from 'lucide-react';
import ChangePassword from '@/app/components/ChangePasswordForm';
import { readFacilities } from '@/utils/supabase/facility';
// import { readScheduledEvents } from '@/utils/supabase/schedule'; // Commented out
// import { readAdmins } from '@/utils/supabase/admin'; // Commented out

export default function DashboardPage() {
  const [facilitiesCount, setFacilitiesCount] = useState<number | undefined>();
  const [showChangePassword, setShowChangePassword] = useState(true);

  useEffect(() => {
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
      <Container className='!p-[30px]'>
        <section className='mb-8 inline-flex flex-col items-start justify-start self-stretch'>
          <h1 className='text-primary-900 h1 justify-start'>Dashboard</h1>
        </section>
        <section>
          <div className='mb-8 flex justify-center'>
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
                    {facilitiesCount !== undefined
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
        {/*Management Card Section*/}
        <section>
          <div className='mb-8 flex justify-center'>
            <div className='grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Card className='flex flex-1 flex-col'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='lead text-neutral-900'>
                    Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-neutral-400'>
                    Manage facilities and scheduled events
                  </p>
                </CardContent>
                <CardFooter className='mt-auto'>
                  <Button
                    variant='default'
                    className='bg-primary-900 hover:bg-primary-700 w-full cursor-pointer duration-200 ease-in-out'
                    onClick={() => (window.location.href = '/admin/facilities')}
                  >
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        {/* Change Password Section */}
        <section>
          <div className='flex justify-center'>
            <div className='grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Card className='flex flex-1 flex-col'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='lead text-neutral-900'>
                    Account Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-neutral-400'>
                    Change your administrator password
                  </p>
                </CardContent>
                <CardFooter className='mt-auto'>
                  <Button
                    variant='default'
                    className='bg-primary-900 hover:bg-primary-700 w-full cursor-pointer duration-200 ease-in-out'
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          {/* Modal Overlay for ChangePassword */}
          {showChangePassword && (
            <div className='relative w-full max-w-xl rounded-xl bg-white p-8 shadow-lg'>
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
