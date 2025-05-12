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

    useEffect(() => {
        async function loadData() {
            const scheduleData = await readSchedules();
            setSchedules(scheduleData);
            const facilityData = await readFacilities();
            setFacilities(facilityData);
        }
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Time and Date Validation
  const startTime = formData.time_start;
  const endTime = formData.time_end;
  const startDate = formData.date_start;
  const endDate = formData.date_end;

  if (endTime <= startTime) {
    alert('End time must be later than start time.');
    return;
  }

  if (endDate < startDate) {
    alert('End date must be the same or later than start date.');
    return;
  }

  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => form.append(key, value));
  
  try {
    await createSchedule(form);
    const refreshed = await readSchedules();
    setSchedules(refreshed);
  } catch (error) {
    alert('Failed to create schedule: ' + (error as Error).message);
  }
};

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            await deleteSchedule(id);
            setSchedules(await readSchedules());
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 text-black">
            <h1 className="text-2xl font-bold mb-4">Create Schedule</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    name="facility_id"
                    value={formData.facility_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                >
                    <option value="">Select Facility</option>
                    {facilities.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.roomname} ({f.type})
                        </option>
                    ))}
                </select>
                <input
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    placeholder="Event Name"
                    className="w-full border rounded p-2"
                />
                <input
                    type="time"
                    name="time_start"
                    value={formData.time_start}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
                <input
                    type="time"
                    name="time_end"
                    value={formData.time_end}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
                <input
                    type="date"
                    name="date_start"
                    value={formData.date_start}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
                <input
                    type="date"
                    name="date_end"
                    value={formData.date_end}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
                <select
                    name="repeat_type"
                    value={formData.repeat_type}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                >
                    <option value="">Select Repeat Type</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="once">Once</option>
                </select>

                <select
                    name="repeat_dates"
                    value={formData.repeat_dates}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                >
                    <option value="">Select Repeat Dates</option>
                    <option value="WF">WF (Wednesday, Friday)</option>
                    <option value="TTH">TTH (Tuesday, Thursday)</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Friday">None</option>
                </select>
                <input
                    name="faculty_in_charge"
                    value={formData.faculty_in_charge}
                    onChange={handleChange}
                    placeholder="Faculty In Charge"
                    className="w-full border rounded p-2"
                />
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description (optional)"
                    className="w-full border rounded p-2"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Create Schedule
                </button>
            </form>

            <h2 className="text-xl font-semibold mt-8 mb-4">Existing Schedules</h2>
            <ul className="space-y-4">
                {schedules.map((s) => (
                    <li key={s.id} className="border rounded p-4 bg-white shadow">
                        <p><strong>Event:</strong> {s.event}</p>
                        <p><strong>Facility:</strong> {s.facilities?.roomname} ({s.facilities?.type})</p>
                        <p><strong>Time:</strong> {s.time_start} - {s.time_end}</p>
                        <p><strong>Date:</strong> {s.date_start} to {s.date_end}</p>
                        <p><strong>Repeat:</strong> {s.repeat_type} ({s.repeat_dates})</p>
                        <p><strong>Faculty:</strong> {s.faculty_in_charge}</p>
                        {s.description && <p><strong>Description:</strong> {s.description}</p>}
                        <button
                            onClick={() => handleDelete(s.id)}
                            className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}