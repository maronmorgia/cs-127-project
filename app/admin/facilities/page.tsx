'use client';

import {
  createFacility,
  readFacilities,
  updateFacility,
  deleteFacility,
} from '@/utils/supabase/facility';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CreateFacilityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [filter, setFilter] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await readFacilities();
        setFacilities(data);
      } catch (err) {
        setFetchError(
          err instanceof Error ? err.message : 'Failed to fetch facilities'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await createFacility(formData);
      const data = await readFacilities();
      setFacilities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create facility'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (id: number, field: string, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id: number) => {
    const form = new FormData();
    const currentEdit = editForm[id];
    form.append('type', currentEdit.type);
    form.append('roomname', currentEdit.roomname);
    form.append('capacity', currentEdit.capacity);
    form.append('schedule', currentEdit.schedule || '');
    await updateFacility(id, form);
    const data = await readFacilities();
    setFacilities(data);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      await deleteFacility(id);
      const data = await readFacilities();
      setFacilities(data);
    }
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchType = filter === 'all' || facility.type === filter;
    const matchId = searchId === '' || facility.id?.toString() === searchId;
    return matchType && matchId;
  });

  return (
    <div className='mx-auto max-w-md rounded-lg bg-white p-6 text-black shadow-md'>
      <h1 className='mb-6 text-2xl font-bold text-black'>
        Create New Facility
      </h1>

      {error && (
        <div className='mb-4 rounded bg-red-100 p-4 text-black'>{error}</div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4 text-black'>
        <div>
          <label
            htmlFor='type'
            className='block text-sm font-medium text-black'
          >
            Facility Type
          </label>
          <select
            id='type'
            name='type'
            required
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value=''>Select a type</option>
            <option value='classroom'>Classroom</option>
            <option value='laboratory'>Laboratory</option>
            <option value='meeting-room'>Meeting Room</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='roomname'
            className='block text-sm font-medium text-black'
          >
            Room Name
          </label>
          <input
            type='text'
            id='roomname'
            name='roomname'
            required
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='capacity'
            className='block text-sm font-medium text-black'
          >
            Capacity
          </label>
          <input
            type='number'
            id='capacity'
            name='capacity'
            required
            min='1'
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='schedule'
            className='block text-sm font-medium text-black'
          >
            Schedule (optional)
          </label>
          <input
            type='text'
            id='schedule'
            name='schedule'
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm'
          />
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {isSubmitting ? 'Creating...' : 'Create Facility'}
          </button>
        </div>
      </form>

      <div className='mt-10 text-black'>
        <h2 className='mb-4 text-xl font-semibold text-black'>
          Existing Facilities
        </h2>

        <div className='mb-4'>
          <label
            htmlFor='filter'
            className='block text-sm font-medium text-black'
          >
            Filter by Type
          </label>
          <select
            id='filter'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 p-2 text-black shadow-sm'
          >
            <option value='all'>All</option>
            <option value='classroom'>Classroom</option>
            <option value='laboratory'>Laboratory</option>
            <option value='meeting-room'>Meeting Room</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='searchId'
            className='block text-sm font-medium text-black'
          >
            Search by ID
          </label>
          <input
            type='text'
            id='searchId'
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder='Enter Facility ID'
            className='mt-1 block w-full rounded-md border-gray-300 p-2 text-black shadow-sm'
          />
        </div>

        {fetchError && (
          <div className='mb-4 rounded bg-red-100 p-4 text-black'>
            {fetchError}
          </div>
        )}
        {loading ? (
          <p>Loading facilities...</p>
        ) : filteredFacilities.length === 0 ? (
          <p>No facilities found.</p>
        ) : (
          <div className='grid gap-4'>
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className='rounded bg-gray-50 p-4 text-black shadow'
              >
                {editingId === facility.id ? (
                  <>
                    <select
                      defaultValue={facility.type}
                      onChange={(e) =>
                        handleEditChange(facility.id, 'type', e.target.value)
                      }
                      className='mb-2 block w-full rounded-md border p-2'
                    >
                      <option value=''>Select a type</option>
                      <option value='classroom'>Classroom</option>
                      <option value='laboratory'>Laboratory</option>
                      <option value='meeting-room'>Meeting Room</option>
                    </select>
                    <input
                      type='text'
                      defaultValue={facility.roomname}
                      onChange={(e) =>
                        handleEditChange(
                          facility.id,
                          'roomname',
                          e.target.value
                        )
                      }
                      className='mb-2 block w-full rounded-md border p-2'
                    />
                    <input
                      type='number'
                      defaultValue={facility.capacity}
                      onChange={(e) =>
                        handleEditChange(
                          facility.id,
                          'capacity',
                          e.target.value
                        )
                      }
                      className='mb-2 block w-full rounded-md border p-2'
                    />
                    <input
                      type='text'
                      defaultValue={facility.schedule}
                      onChange={(e) =>
                        handleEditChange(
                          facility.id,
                          'schedule',
                          e.target.value
                        )
                      }
                      className='mb-2 block w-full rounded-md border p-2'
                    />
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={() => handleUpdate(facility.id)}
                        className='rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className='rounded bg-gray-300 px-3 py-1 hover:bg-gray-400'
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className='text-lg font-medium text-black'>
                      {facility.roomname}
                    </h3>
                    <p>ID: {facility.id}</p>
                    <p>Type: {facility.type}</p>
                    <p>Capacity: {facility.capacity}</p>
                    <p>Schedule: {facility.schedule || 'N/A'}</p>
                    <div className='mt-2 flex justify-end space-x-2'>
                      <button
                        onClick={() => {
                          setEditingId(facility.id);
                          setEditForm((prev) => ({
                            ...prev,
                            [facility.id]: {
                              type: facility.type,
                              roomname: facility.roomname,
                              capacity: facility.capacity,
                              schedule: facility.schedule || '',
                            },
                          }));
                        }}
                        className='rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(facility.id)}
                        className='rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700'
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
