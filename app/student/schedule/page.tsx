'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { readSchedules } from '@/utils/supabase/schedule';
import { readFacilities } from '@/utils/supabase/facility';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Container from '@/app/components/Container';
import CalendarApp from '@/app/components/CalendarApp';

type ScheduleFormValues = {
  id: number;
  facility_id: string;
  event: string;
  time_start: string;
  time_end: string;
  date_start: string;
  date_end: string;
  repeat_type: string;
  repeat_dates: string;
  faculty_in_charge: string;
  description: string;
};

type FacilityFormValues = {
  id: string;
  type: string;
  roomname: string;
  capacity: number | string;
};

type ScheduleRecord = Record<string, unknown> & {
  id: number;
  facility_id: string;
  event: string;
  time_start: string;
  time_end: string;
  date_start: string;
  date_end: string;
  repeat_type: string;
  repeat_dates: string;
  faculty_in_charge: string;
  description: string;
  facilities?: {
    roomname: string;
  };
};

type FacilityRecord = Record<string, unknown> & {
  id: string;
  roomname: string;
  type: string;
};

export default function UserSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const searchParams = useSearchParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [scheduleData, facilityData] = await Promise.all([
        readSchedules(),
        readFacilities(),
      ]);

      const facilitiesList = (facilityData as FacilityRecord[]) || [];
      setFacilities(facilitiesList);
      setSchedules((scheduleData as ScheduleRecord[]) || []);

      const roomnameParam = searchParams.get('roomname');
      if (roomnameParam) {
        const match = facilitiesList.find((f) => f.roomname === roomnameParam);
        if (match) setSelectedFacilityId(match.id);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSchedules = selectedFacilityId
    ? schedules.filter((s) => s.facility_id === selectedFacilityId)
    : schedules;

  if (loading) {
    return (
      <main>
        <Navbar variant='facility' />
        <Container className='!py-[30px]'>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-lg'>Loading...</div>
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar variant='facility' />
        <Container className='!py-[30px]'>
          <div className='py-8 text-center'>
            <div className='mb-4 text-lg text-red-600'>{error}</div>
            <button
              onClick={fetchData}
              className='bg-primary-900 rounded px-4 py-2 text-white'
            >
              Retry
            </button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Navbar variant='facility' />
      <Container className='!py-[30px]'>
        <section className='flex flex-col gap-7'>
          <header>
            <Breadcrumb className='small w-full max-w-[575px] whitespace-nowrap'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Schedule</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <header className='flex flex-col gap-3'>
            <h3 className='text-primary-900 leading-7'>Schedule Calendar</h3>
            <p className='small leading-5 text-neutral-400'>
              View facility booking schedules and availability.
            </p>
          </header>

          <div className='w-full max-w-[300px] mb-4'>
            <label htmlFor='facilityFilter' className='medium text-neutral-900 mb-1 block'>
              Filter by Facility
            </label>
            <select
              id='facilityFilter'
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className='w-full rounded border border-neutral-400 bg-white p-2 text-black'
            >
              <option value=''>All Facilities</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.roomname} ({f.type})
                </option>
              ))}
            </select>
          </div>

          <CalendarApp
            schedules={filteredSchedules as ScheduleFormValues[]}
            facilities={facilities as FacilityFormValues[]}
          />
        </section>
      </Container>
    </main>
  );
}
