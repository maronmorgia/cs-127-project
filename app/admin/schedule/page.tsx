'use client';

import { useEffect, useState } from 'react';
import {
  createSchedule,
  readSchedules,
  updateSchedule,
  deleteSchedule,
} from '@/utils/supabase/schedule';
import { readFacilities } from '@/utils/supabase/facility';

type Schedule = {
  id: number;
  facility_id: number;
  time_start: string;
  time_end: string;
  date_start: string;
  date_end: string;
  repeat_type: string;
  repeat_dates: string;
  event: string;
  faculty_in_charge: string;
  description?: string;
  facilities?: {
    roomname: string;
    type: string;
  };
};

type Facility = {
  id: number;
  roomname: string;
  type: string;
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    facility_id: '',
    time_start: '',
    time_end: '',
    date_start: '',
    date_end: '',
    repeat_type: '',
    repeat_dates: '',
    event: '',
    faculty_in_charge: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadData() {
      const scheduleData = await readSchedules();
      setSchedules(scheduleData);
      const facilityData = await readFacilities();
      setFacilities(facilityData);
    }
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      facility_id: '',
      time_start: '',
      time_end: '',
      date_start: '',
      date_end: '',
      repeat_type: '',
      repeat_dates: '',
      event: '',
      faculty_in_charge: '',
      description: '',
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.time_end <= formData.time_start) {
      alert('End time must be later than start time.');
      return;
    }
    if (formData.date_end < formData.date_start) {
      alert('End date must be the same or later than start date.');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'id') form.append(key, value.toString());
    });

    try {
      if (isEditing) {
        await updateSchedule(formData.id, form);
      } else {
        await createSchedule(form);
      }
      setSchedules(await readSchedules());
      resetForm();
    } catch (error) {
      alert('Failed to save schedule: ' + (error as Error).message);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setFormData({
      id: schedule.id,
      facility_id: schedule.facility_id.toString(),
      time_start: schedule.time_start,
      time_end: schedule.time_end,
      date_start: schedule.date_start,
      date_end: schedule.date_end,
      repeat_type: schedule.repeat_type,
      repeat_dates: schedule.repeat_dates,
      event: schedule.event,
      faculty_in_charge: schedule.faculty_in_charge,
      description: schedule.description || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      await deleteSchedule(id);
      setSchedules(await readSchedules());
    }
  };

  return (
    <div className='mx-auto max-w-2xl p-4 text-black'>
      <h1 className='mb-4 text-2xl font-bold'>
        {isEditing ? 'Update Schedule' : 'Create Schedule'}
      </h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <select
          name='facility_id'
          value={formData.facility_id}
          onChange={handleChange}
          required
          className='w-full rounded border p-2'
        >
          <option value=''>Select Facility</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.roomname} ({f.type})
            </option>
          ))}
        </select>

        <input
          name='event'
          value={formData.event}
          onChange={handleChange}
          required
          placeholder='Event Name'
          className='w-full rounded border p-2'
        />

        <div>
          <label className='mb-1 block font-medium'>Start Time</label>
          <input
            type='time'
            name='time_start'
            value={formData.time_start}
            onChange={handleChange}
            required
            min='06:00'
            max='18:00'
            className='w-full rounded border p-2'
          />
        </div>
        <div>
          <label className='mb-1 block font-medium'>End Time</label>
          <input
            type='time'
            name='time_end'
            value={formData.time_end}
            onChange={handleChange}
            required
            min='06:00'
            max='18:00'
            className='w-full rounded border p-2'
          />
        </div>

        <div>
          <label className='mb-1 block font-medium'>Start Date</label>
          <input
            type='date'
            name='date_start'
            value={formData.date_start}
            onChange={handleChange}
            required
            className='w-full rounded border p-2'
          />
        </div>
        <div>
          <label className='mb-1 block font-medium'>End Date</label>
          <input
            type='date'
            name='date_end'
            value={formData.date_end}
            onChange={handleChange}
            min={formData.date_start}
            required
            className='w-full rounded border p-2'
          />
        </div>

        <select
          name='repeat_type'
          value={formData.repeat_type}
          onChange={handleChange}
          required
          className='w-full rounded border p-2'
        >
          <option value=''>Select Repeat Type</option>
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='once'>Once</option>
        </select>

        <select
          name='repeat_dates'
          value={formData.repeat_dates}
          onChange={handleChange}
          required
          className='w-full rounded border p-2'
        >
          <option value=''>Select Repeat Dates</option>
          <option value='WF'>WF (Wednesday, Friday)</option>
          <option value='TTH'>TTH (Tuesday, Thursday)</option>
          <option value='Monday'>Monday</option>
          <option value='Tuesday'>Tuesday</option>
          <option value='Wednesday'>Wednesday</option>
          <option value='Thursday'>Thursday</option>
          <option value='Friday'>Friday</option>
          <option value='None'>None</option>
        </select>

        <input
          name='faculty_in_charge'
          value={formData.faculty_in_charge}
          onChange={handleChange}
          placeholder='Faculty In Charge'
          className='w-full rounded border p-2'
        />
        <input
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Description (optional)'
          className='w-full rounded border p-2'
        />

        <div className='flex gap-2'>
          <button
            type='submit'
            className='flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700'
          >
            {isEditing ? 'Update' : 'Create'} Schedule
          </button>
          {isEditing && (
            <button
              type='button'
              onClick={resetForm}
              className='flex-1 rounded bg-gray-400 py-2 text-white hover:bg-gray-500'
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className='mt-8 mb-4 text-xl font-semibold'>Existing Schedules</h2>
      <ul className='space-y-4'>
        {schedules.map((s) => (
          <li key={s.id} className='rounded border bg-white p-4 shadow'>
            <p>
              <strong>Event:</strong> {s.event}
            </p>
            <p>
              <strong>Facility:</strong> {s.facilities?.roomname} (
              {s.facilities?.type})
            </p>
            <p>
              <strong>Time:</strong> {s.time_start} - {s.time_end}
            </p>
            <p>
              <strong>Date:</strong> {s.date_start} to {s.date_end}
            </p>
            <p>
              <strong>Repeat:</strong> {s.repeat_type} ({s.repeat_dates})
            </p>
            <p>
              <strong>Faculty:</strong> {s.faculty_in_charge}
            </p>
            {s.description && (
              <p>
                <strong>Description:</strong> {s.description}
              </p>
            )}
            <div className='mt-2 flex gap-2'>
              <button
                onClick={() => handleEdit(s)}
                className='rounded bg-yellow-500 px-4 py-1 text-white hover:bg-yellow-600'
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className='rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
