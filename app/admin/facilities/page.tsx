'use client';

import { createFacility, readFacilities, updateFacility } from '@/utils/supabase/facility';
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
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await readFacilities();
        setFacilities(data);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch facilities');
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
      const updated = await readFacilities();
      setFacilities(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEdit = (id: number) => {
    if (editId === id) {
      setEditId(null);
    } else {
      setEditId(id);
      const facility = facilities.find((f) => f.id === id);
      setEditValues((prev) => ({
        ...prev,
        [id]: {
          roomname: facility.roomname,
          type: facility.type,
          capacity: facility.capacity,
          schedule: facility.schedule || '',
        },
      }));
    }
  };

  const handleEditChange = (id: number, field: string, value: string | number) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id: number) => {
    try {
      const values = editValues[id];
      const formData = new FormData();
      formData.append('roomname', values.roomname);
      formData.append('type', values.type);
      formData.append('capacity', values.capacity.toString());
      formData.append('schedule', values.schedule);

      await updateFacility(id, formData);
      const updated = await readFacilities();
      setFacilities(updated);
      setEditId(null);
    } catch {
      alert('Failed to update facility');
    }
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchType = filter === 'all' || facility.type === filter;
    const matchId = searchId === '' || facility.id?.toString() === searchId;
    return matchType && matchId;
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Create New Facility</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-black rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-black">
            Facility Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-black"
          >
            <option value="">Select a type</option>
            <option value="classroom">Classroom</option>
            <option value="laboratory">Laboratory</option>
            <option value="meeting-room">Meeting Room</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomname" className="block text-sm font-medium text-black">
            Room Name
          </label>
          <input
            type="text"
            id="roomname"
            name="roomname"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-black"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-black">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-black"
          />
        </div>

        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-black">
            Schedule (optional)
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-black"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/facilities')}
            className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-md hover:bg-gray-200 text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Facility'}
          </button>
        </div>
      </form>

      <div className="mt-10 text-black">
        <h2 className="text-xl font-semibold mb-4 text-black">Existing Facilities</h2>

        <div className="mb-4">
          <label htmlFor="filter" className="block text-sm font-medium text-black">Filter by Type</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
          >
            <option value="all">All</option>
            <option value="classroom">Classroom</option>
            <option value="laboratory">Laboratory</option>
            <option value="meeting-room">Meeting Room</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="searchId" className="block text-sm font-medium text-black">Search by ID</label>
          <input
            type="text"
            id="searchId"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Facility ID"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
          />
        </div>

        {fetchError && <div className="mb-4 p-4 bg-red-100 text-black rounded">{fetchError}</div>}
        {loading ? (
          <p>Loading facilities...</p>
        ) : filteredFacilities.length === 0 ? (
          <p>No facilities found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredFacilities.map((facility) => (
              <div key={facility.id} className="p-4 bg-gray-50 rounded shadow text-black">
                {editId === facility.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValues[facility.id]?.roomname || ''}
                      onChange={(e) => handleEditChange(facility.id, 'roomname', e.target.value)}
                      className="w-full p-2 border rounded text-black"
                    />
                    <select
                      value={editValues[facility.id]?.type || ''}
                      onChange={(e) => handleEditChange(facility.id, 'type', e.target.value)}
                      className="w-full p-2 border rounded text-black"
                    >
                      <option value="classroom">Classroom</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="meeting-room">Meeting Room</option>
                    </select>
                    <input
                      type="number"
                      value={editValues[facility.id]?.capacity || ''}
                      onChange={(e) => handleEditChange(facility.id, 'capacity', parseInt(e.target.value))}
                      className="w-full p-2 border rounded text-black"
                    />
                    <input
                      type="text"
                      value={editValues[facility.id]?.schedule || ''}
                      onChange={(e) => handleEditChange(facility.id, 'schedule', e.target.value)}
                      className="w-full p-2 border rounded text-black"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(facility.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit(facility.id)}
                        className="px-4 py-1 bg-gray-300 text-black rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-black">{facility.roomname}</h3>
                    <p>ID: {facility.id}</p>
                    <p>Type: {facility.type}</p>
                    <p>Capacity: {facility.capacity}</p>
                    <p>Schedule: {facility.schedule || 'N/A'}</p>
                    <button
                      onClick={() => toggleEdit(facility.id)}
                      className="mt-2 text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
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
