'use client';

import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';
import { readFacilities } from '@/utils/supabase/facility';
import { useState, useEffect } from 'react';
import { Funnel, Search } from 'lucide-react';
import FacilityCard, { Facility } from '@/app/components/FacilityCard';

export default function UserFacilityPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await readFacilities();
        setFacilities(data);
      } catch (error: unknown) {
        setFetchError(
          error instanceof Error ? error.message : 'Failed to fetch facilities'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const filteredFacilities = facilities.filter((facility) => {
    const matchType = filter === 'all' || facility.type === filter;
    const matchId = searchId === '' || facility.id.toString() === searchId;
    return matchType && matchId;
  });

  return (
    <main>
      <Navbar variant='facility' />
      <Container className='!p-[30px]'>
        <section className='flex flex-col justify-center gap-4 text-center'>
          {/* Search Bar */}
          <div className='flex w-full items-center gap-2.5 rounded-[10px] border border-neutral-400 px-3 py-2.5'>
            <Search className='h-4 w-4 text-black' />
            <input
              type='text'
              placeholder='Search room number'
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className='small w-full text-black placeholder:text-neutral-400 focus:outline-none'
            />
          </div>

          {/* Filter Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className='small flex items-center gap-1 rounded-[6px] border border-neutral-400 px-4 py-2 text-neutral-900'
            >
              <Funnel className='h-4 w-4' />
              Filter
            </button>

            {showFilter && (
              <div className='absolute z-10 mt-2 w-48 rounded-md border border-neutral-200 bg-white shadow-md'>
                <ul className='text-sm text-neutral-700'>
                  {['all', 'classroom', 'laboratory', 'meeting'].map((type) => (
                    <li key={type}>
                      <button
                        className={`w-full px-4 py-2 text-left hover:bg-neutral-100 ${
                          filter === type ? 'font-semibold' : ''
                        }`}
                        onClick={() => {
                          setFilter(type);
                          setShowFilter(false);
                        }}
                      >
                        {type === 'all'
                          ? 'All Types'
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Facility List */}
          <section className='w-full max-w-[575px] border-t border-neutral-400'>
            {loading ? (
              <p>Loading...</p>
            ) : fetchError ? (
              <p className='text-red-500'>{fetchError}</p>
            ) : (
              <div className='mt-4 grid w-full grid-cols-2 items-stretch gap-x-[12px] gap-y-[20px]'>
                {filteredFacilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </Container>
    </main>
  );
}
