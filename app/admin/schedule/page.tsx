'use client';

import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Navbar from '@/app/components/Navbar';
import {
  createSchedule,
  readSchedules,
  updateSchedule,
  deleteSchedule,
} from '@/utils/supabase/schedule';
import { readFacilities } from '@/utils/supabase/facility';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Container from '@/app/components/Container';
import { DatePicker } from '@/app/components/DatePicker';
import { CustomSelect } from '@/app/components/CustomSelect';
import CalendarApp from '@/app/components/CalendarApp';
import { Plus, SquarePen } from 'lucide-react';

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

// Use Record types for maximum flexibility
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

export default function SchedulePage() {
  const [view, setView] = useState<'home' | 'form'>('home');
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [editValues, setEditValues] = useState<ScheduleFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching schedules and facilities...');

      const [scheduleData, facilityData] = await Promise.all([
        readSchedules(),
        readFacilities(),
      ]);

      console.log('Fetched schedules:', scheduleData?.length || 0);
      console.log('Fetched facilities:', facilityData?.length || 0);

      setSchedules((scheduleData as ScheduleRecord[]) || []);
      setFacilities((facilityData as FacilityRecord[]) || []);
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

  const validationSchema = Yup.object({
    facility_id: Yup.string().required('Facility is required'),
    event: Yup.string().required('Event name is required'),
    time_start: Yup.string().required('Start time is required'),
    time_end: Yup.string()
      .required('End time is required')
      .test(
        'is-after-start',
        'End time must be later than start time',
        function (value) {
          const { time_start } = this.parent;
          if (!time_start || !value) return true;
          return value > time_start;
        }
      ),
    date_start: Yup.string().required('Start date is required'),
    date_end: Yup.string()
      .required('End date is required')
      .test(
        'is-after-start',
        'End date must be same or after start date',
        function (value) {
          return value >= this.parent.date_start;
        }
      ),
    repeat_type: Yup.string()
      .required('Repeat type is required')
      .oneOf(['once', 'daily', 'weekly']),
    repeat_dates: Yup.string().test(
      'repeat-dates-validity',
      'Repeat dates are required unless the event is one-time.',
      function (value) {
        const { repeat_type } = this.parent;
        if (repeat_type === 'once') return true;
        return !!value && value.trim() !== '';
      }
    ),
    faculty_in_charge: Yup.string().required('Faculty is required'),
    description: Yup.string().required('Description is required'),
  });

  const initialValues: ScheduleFormValues = editValues || {
    id: 0,
    facility_id: '',
    event: '',
    time_start: '',
    time_end: '',
    date_start: '',
    date_end: '',
    repeat_type: '',
    repeat_dates: '',
    faculty_in_charge: '',
    description: '',
  };

  const handleSubmit = async (
    values: ScheduleFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ScheduleFormValues>
  ) => {
    try {
      setSubmitting(true);
      console.log('Submitting schedule:', values);

      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'id' && value !== '') {
          form.append(key, value.toString());
        }
      });

      if (values.id) {
        await updateSchedule(values.id, form);
        console.log('Schedule updated successfully');
      } else {
        await createSchedule(form);
        console.log('Schedule created successfully');
      }

      // Refresh the data after successful submission
      await fetchData();

      // Reset form and navigate back
      setEditValues(null);
      resetForm();
      setView('home');
    } catch (error) {
      console.error('Submit error:', error);
      alert(
        `Failed to ${values.id ? 'update' : 'create'} schedule: ${(error as Error).message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    // Remove the confirm() since CalendarApp already handles confirmation
    try {
      console.log('Deleting schedule:', scheduleId);
      await deleteSchedule(scheduleId);
      console.log('Schedule deleted successfully');
      // Refresh the data after deletion
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete schedule: ' + (error as Error).message);
    }
  };

  const handleEdit = (schedule: ScheduleRecord) => {
    console.log('Editing schedule:', schedule);
    setEditValues(schedule as ScheduleFormValues);
    setView('form');
  };

  const handleCancel = () => {
    setView('home');
    setEditValues(null);
  };

  // Handler for edit action from calendar modal
  const handleCalendarEdit = (schedule: ScheduleRecord) => {
    console.log('Editing schedule from calendar:', schedule);
    handleEdit(schedule);
  };

  // Handler for delete action from calendar modal
  const handleCalendarDelete = async (scheduleId: number) => {
    await handleDelete(scheduleId);
  };

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
        {view === 'home' && (
          <section className='flex flex-col gap-7'>
            <header>
              <Breadcrumb className='small w-full max-w-[575px] whitespace-nowrap'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href='/admin'>Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Schedule</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <section className='w-full max-w-[1200px] border-neutral-400'>
              <div className='flex gap-2'>
                <button
                  className='bg-primary-900 small mb-4 flex items-center gap-2 rounded px-3 py-1.5 text-white'
                  onClick={() => setView('form')}
                >
                  <Plus className='text-white' />
                  Create
                </button>
                <button
                  className='bg-secondary-900 small mb-4 flex items-center gap-2 rounded px-3 py-1.5 text-white'
                  onClick={() => setView('form')}
                >
                  <SquarePen className='text-white' />
                  Edit Facility
                </button>
              </div>

              {/* Former Existing Schedules */}
              {/* <ul className='mt-4 space-y-4'>
                {schedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className='rounded border border-neutral-400 bg-white p-4 text-black shadow-sm'
                  >
                    <p>
                      <strong>{schedule.event}</strong> ({schedule.date_start}{' '}
                      to {schedule.date_end}, {schedule.time_start}–
                      {schedule.time_end})
                    </p>
                    <p>
                      Facility:{' '}
                      {facilities.find((f) => f.id === schedule.facility_id)
                        ?.roomname ||
                        schedule.facilities?.roomname ||
                        'Unknown'}
                    </p>
                    <p>
                      Repeat: {schedule.repeat_type} on {schedule.repeat_dates}
                    </p>
                    <div className='mt-2 flex gap-2'>
                      <button
                        className='rounded bg-yellow-500 px-4 py-1 text-white'
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </button>
                      <button
                        className='rounded bg-red-600 px-4 py-1 text-white'
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul> */}
            </section>

            {/* Calendar component with edit and delete handlers */}
            <CalendarApp
              schedules={schedules as ScheduleFormValues[]}
              facilities={facilities as FacilityFormValues[]}
              onEditSchedule={handleCalendarEdit}
              onDeleteSchedule={handleCalendarDelete}
            />
          </section>
        )}

        {view === 'form' && (
          <section className='flex flex-col gap-7'>
            <header>
              <Breadcrumb className='small w-full max-w-[575px] whitespace-nowrap'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href='/admin'>Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbEllipsis />
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href='#'
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        handleCancel();
                      }}
                    >
                      Schedule
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <BreadcrumbLink>
                        {editValues ? 'Edit Schedule' : 'Add Schedule'}
                      </BreadcrumbLink>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <header className='flex flex-col gap-1'>
              <h1 className='lead text-primary-900 leading-7'>
                {editValues ? 'Update Schedule' : 'Add Schedule'}
              </h1>
              <p className='small leading-5 text-neutral-400'>
                Provide the details needed for a schedule.
              </p>
            </header>

            <section className='w-full max-w-[575px] space-y-6 rounded border border-neutral-400 bg-white p-6 shadow-sm'>
              <header className='lead text-primary-900 leading-7'>
                Event Details
              </header>

              <Formik<ScheduleFormValues>
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className='space-y-5'>
                    <section className='flex flex-col gap-3'>
                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='facility_id'
                          className='medium leading-6 text-neutral-900'
                        >
                          Facility<span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          as='select'
                          id='facility_id'
                          name='facility_id'
                          className='medium w-full rounded border border-neutral-400 bg-white p-2 text-black'
                        >
                          <option value=''>Select Facility</option>
                          {facilities.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.roomname} ({f.type})
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name='facility_id'
                          className='text-sm text-red-500'
                          component='div'
                        />
                      </fieldset>

                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='event'
                          className='medium leading-6 text-neutral-900'
                        >
                          Event Title
                          <span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          id='event'
                          name='event'
                          placeholder='Enter event title'
                          className='w-full rounded border border-neutral-400 p-2 text-black'
                        />
                        <ErrorMessage
                          name='event'
                          className='text-sm text-red-500'
                          component='div'
                        />
                      </fieldset>

                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='faculty_in_charge'
                          className='medium leading-6 text-neutral-900'
                        >
                          Faculty-In-Charge
                          <span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          id='faculty_in_charge'
                          name='faculty_in_charge'
                          placeholder='Enter faculty name'
                          className='w-full rounded border border-neutral-400 p-2 text-black'
                        />
                        <ErrorMessage
                          name='faculty_in_charge'
                          className='text-sm text-red-500'
                          component='div'
                        />
                      </fieldset>

                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='description'
                          className='medium leading-6 text-neutral-900'
                        >
                          Description
                          <span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          as='textarea'
                          id='description'
                          name='description'
                          rows={3}
                          placeholder='Enter description of event'
                          className='w-full rounded border border-neutral-400 p-2 text-black'
                        />
                        <ErrorMessage
                          name='description'
                          className='text-sm text-red-500'
                          component='div'
                        />
                      </fieldset>

                      <hr className='mt-4 w-full border-neutral-400' />
                    </section>

                    <section className='flex flex-col gap-3'>
                      <header className='lead text-primary-900 leading-7'>
                        Date and Time
                      </header>

                      <DatePicker name='date_start' label='Start Date' />
                      <DatePicker name='date_end' label='End Date' />

                      <div>
                        <label className='medium leading-6 text-neutral-900'>
                          Start Time
                          <span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          type='time'
                          name='time_start'
                          min='06:00'
                          max='18:00'
                          className='w-full rounded border border-neutral-400 p-2 text-black'
                        />
                        <ErrorMessage
                          name='time_start'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>

                      <div>
                        <label className='medium leading-6 text-neutral-900'>
                          End Time<span className='text-secondary-700'> *</span>
                        </label>
                        <Field
                          type='time'
                          name='time_end'
                          min='06:00'
                          max='18:00'
                          className='w-full rounded border border-neutral-400 p-2 text-black'
                        />
                        <ErrorMessage
                          name='time_end'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>
                    </section>

                    <hr className='mt-4 w-full border-neutral-400' />

                    <section className='flex flex-col gap-3'>
                      <header className='lead text-primary-900 leading-7'>
                        Recurrence Details
                      </header>

                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='repeat_type'
                          className='medium leading-6 text-neutral-900'
                        >
                          Repeat Type
                          <span className='text-secondary-700'> *</span>
                        </label>
                        <CustomSelect
                          name='repeat_type'
                          placeholder='Select Repeat Type'
                          options={[
                            { value: 'once', label: 'Once' },
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                          ]}
                        />
                        <ErrorMessage
                          name='repeat_type'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </fieldset>

                      <fieldset className='flex flex-col gap-1'>
                        <label
                          htmlFor='repeat_dates'
                          className='medium leading-6 text-neutral-900'
                        >
                          Repeat Dates
                        </label>
                        <CustomSelect
                          name='repeat_dates'
                          placeholder='Select Repeat Dates'
                          options={[
                            { value: 'Monday', label: 'Monday' },
                            { value: 'Tuesday', label: 'Tuesday' },
                            { value: 'Wednesday', label: 'Wednesday' },
                            { value: 'Thursday', label: 'Thursday' },
                            { value: 'Friday', label: 'Friday' },
                            { value: 'Saturday', label: 'Saturday' },
                            { value: 'WF', label: 'Wednesday & Friday' },
                            { value: 'TTH', label: 'Tuesday & Thursday' },
                            { value: 'None', label: 'None' },
                          ]}
                        />
                        <ErrorMessage
                          name='repeat_dates'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </fieldset>
                    </section>

                    <hr className='mt-4 w-full border-neutral-400' />

                    <div className='mt-6 flex w-full justify-end gap-2'>
                      <div className='w-1/2'>
                        <button
                          type='button'
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className='medium w-full rounded-[6px] border border-neutral-900 px-4 py-2 text-neutral-900 transition-all duration-200 ease-in-out hover:bg-neutral-900 hover:text-white disabled:opacity-50'
                        >
                          Cancel
                        </button>
                      </div>
                      <div className='w-1/2'>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='medium bg-primary-900 hover:bg-primary-700 w-full rounded-[6px] px-2 py-2 text-white transition-all duration-200 ease-in-out disabled:opacity-50'
                        >
                          {isSubmitting
                            ? 'Saving...'
                            : editValues
                              ? 'Update Schedule'
                              : 'Add Schedule'}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
          </section>
        )}
      </Container>
    </main>
  );
}
