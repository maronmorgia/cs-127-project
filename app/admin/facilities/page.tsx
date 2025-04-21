'use client';

import { createFacility } from '@/utils/supabase/facility';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateFacilityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await createFacility(formData);
      router.push('/facilities'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Facility</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Facility Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">Select a type</option>
            <option value="classroom">Classroom</option>
            <option value="laboratory">Laboratory</option>
            <option value="meeting-room">meeting-room</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomname" className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            type="text"
            id="roomname"
            name="roomname"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
            Schedule (optional)
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/facilities')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
    </div>
  );
}