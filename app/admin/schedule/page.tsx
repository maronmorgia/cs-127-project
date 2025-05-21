'use client';

import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers, useField } from 'formik';
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
import CustomTimePicker from '@/app/components/TimePicker';

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

export default function SchedulePage() {
  const [view, setView] = useState<'home' | 'form'>('home');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [editValues, setEditValues] = useState<ScheduleFormValues | null>(null);

  useEffect(() => {
    (async () => {
      const scheduleData = await readSchedules();
      const facilityData = await readFacilities();
      setSchedules(scheduleData);
      setFacilities(facilityData);
    })();
  }, []);

  const parseTimeString = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const validationSchema = Yup.object({
    facility_id: Yup.string().required('Facility is required'),
    event: Yup.string().required('Event name is required'),
    time_start: Yup.string().required('Start time is required'),
    time_end: Yup.string()
      .required('End time is required')
      .test('is-after-start', 'End time must be later than start time', function (value) {
        const { time_start } = this.parent;
        if (!time_start || !value) return true;

        const parseTime = (timeStr: string): Date => {
          const [time, modifier] = timeStr.trim().split(' ');
          let [hour, minute] = time.split(':').map(Number);

          if (modifier === 'PM' && hour !== 12) {
            hour += 12;
          }
          if (modifier === 'AM' && hour === 12) {
            hour = 0;
          }

          const date = new Date();
          date.setHours(hour, minute, 0, 0);
          return date;
        };

        const start = parseTime(time_start);
        const end = parseTime(value);

        return end > start;
      }),
    date_start: Yup.string().required('Start date is required'),
    date_end: Yup.string()
      .required('End date is required')
      .test('is-after-start', 'End date must be same or after start date', function (value) {
        return value >= this.parent.date_start;
      }),
    repeat_type: Yup.string()
      .required('Repeat type is required')
      .oneOf(['once', 'daily', 'weekly']),
    repeat_dates: Yup.string()
    .test(
      'repeat-dates-validity',
      'Repeat dates are required unless the event is one-time.',
      function (value) {
        const { repeat_type } = this.parent;

        // If repeat_type is once, allow empty or any value
        if (repeat_type === 'once') return true;

        // For other types, repeat_dates must be selected
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
    { resetForm }: FormikHelpers<ScheduleFormValues>
  ) => {
    try {
      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'id') form.append(key, value.toString());
      });

      if (values.id) {
        await updateSchedule(values.id, form);
      } else {
        await createSchedule(form);
      }

      const updated = await readSchedules();
      setSchedules(updated);
      setEditValues(null);
      resetForm();
    } catch (error) {
      alert('Failed to save: ' + (error as Error).message);
    }
  };

  return (
    <main>
      <Navbar variant='facility' />
      <Container className='!py-[30px]'>
        {view === 'home' && (
          <section className='w-full max-w-[575px] border-t border-neutral-400'>
            <button
              className='bg-primary-900 mb-4 rounded px-4 py-2 text-black'
              onClick={() => setView('form')}
            >
              Create Schedule
            </button>

            <h1 className='text-xl font-semibold'>Existing Schedules</h1>
            <ul className='mt-4 space-y-4'>
              {schedules.map((schedule) => (
                <li
                  key={schedule.id}
                  className='rounded border border-neutral-400 bg-white p-4 text-black shadow-sm'
                >
                  <p>
                    <strong>{schedule.event}</strong> ({schedule.date_start} to{' '}
                    {schedule.date_end}, {schedule.time_start}–
                    {schedule.time_end})
                  </p>
                  <p>
                    Facility:{' '}
                    {facilities.find((f) => f.id === schedule.facility_id)
                      ?.roomname || 'Unknown'}
                  </p>
                  <p>
                    Repeat: {schedule.repeat_type} on {schedule.repeat_dates}
                  </p>
                  <div className='mt-2 flex gap-2'>
                    <button
                      className='rounded bg-yellow-500 px-4 py-1 text-white'
                      onClick={() => {
                        setEditValues(schedule);
                        setView('form');
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className='rounded bg-red-600 px-4 py-1 text-white'
                      onClick={async () => {
                        if (
                          confirm(
                            'Are you sure you want to delete this schedule?'
                          )
                        ) {
                          await deleteSchedule(schedule.id);
                          const updated = await readSchedules();
                          setSchedules(updated);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
                      onClick={(e) => {
                        e.preventDefault();
                        setView('home');
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
                {' '}
                Provide the details needed for a schedule.{' '}
              </p>
            </header>

            <section className='w-full max-w-[575px] space-y-6 rounded border border-neutral-400 bg-white p-6 shadow-sm'>
              <header className='lead text-primary-900 leading-7'>
                Event Details
              </header>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
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
                        className='w-full rounded border border-neutral-400 bg-white p-2 text-black medium'
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
                    </fieldset>

                    <hr className='mt-4 w-full border-neutral-400' />
                  </section>

                  <section className='flex flex-col gap-3'>
                    <header className='lead text-primary-900 leading-7'>
                      Date and Time
                    </header>

                    <DatePicker name='date_start' label='Start Date'/>

                    <DatePicker name='date_end' label='End Date' />

                    <CustomTimePicker label="Start Time" name="time_start" />
                    <CustomTimePicker label="End Time" name="time_end" />
                  </section>
                  
                  <hr className='mt-4 w-full border-neutral-400' />

                  <section className='flex flex-col gap-3'>
                    <header className='lead text-primary-900 leading-7'>
                      Recurrence Details
                    </header>

                  <fieldset className='flex flex-col gap-1'>
                    <label htmlFor='repeat_type' className='medium leading-6 text-neutral-900'>
                      Repeat Type
                    </label>
                    <CustomSelect name='repeat_type' placeholder='Select Repeat Type' options={[
                      { value: 'once', label: 'Once' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                    ]} />
                    <ErrorMessage name='repeat_type' component='div' className='text-sm text-red-500' />
                  </fieldset>

                  <fieldset className='flex flex-col gap-1'>
                    <label htmlFor='repeat_dates' className='medium leading-6 text-neutral-900'>
                      Repeat Dates
                    </label>
                    <CustomSelect name='repeat_dates' placeholder='Select Repeat Dates' options={[
                      { value: 'Monday', label: 'Monday' },
                      { value: 'Tuesday', label: 'Tuesday' },
                      { value: 'Wednesday', label: 'Wednesday' },
                      { value: 'Thursday', label: 'Thursday' },             
                      { value: 'Friday', label: 'Friday' },
                      { value: 'WF', label: 'Wednesday & Friday' },
                      { value: 'TTH', label: 'Tuesday & Thursday' },
                      { value: 'None', label: 'None' },
                    ]} />
                    <ErrorMessage name='repeat_dates' component='div' className='text-sm text-red-500' />
                  </fieldset>
                  </section>
                  
                  <hr className='mt-4 w-full border-neutral-400' />

                  <div className='mt-6 flex w-full justify-end gap-2'>
                    <div className='w-1/2'> 
                      <button
                        type='button'
                        onClick={() => {
                          setView('home');
                          setEditValues(null);
                        }}
                        className='medium w-full rounded-[6px] border border-neutral-900 px-4 py-2 text-neutral-900 transition-all duration-200 ease-in-out hover:bg-neutral-900 hover:text-white disabled:opacity-50'
                      >
                        Cancel
                      </button>
                    </div>
                    <div className='w-1/2'>
                      <button
                        type='submit'
                        className='medium bg-primary-900 hover:bg-primary-700 w-full rounded-[6px] px-2 py-2 text-white transition-all duration-200 ease-in-out disabled:opacity-50'
                      >
                        {editValues ? 'Update Schedule' : 'Add Schedule'}
                    </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </section>
          </section>
        )}
      </Container>
    </main>
  );
}
