'use client';

import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';
import {
  createFacility,
  readFacilities,
  updateFacility,
  deleteFacility,
} from '@/utils/supabase/facility';
import { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  Pencil,
  Subtitles,
  FlaskConical,
  Funnel,
  Search,
} from 'lucide-react';
import FacilityCard from '@/app/components/FacilityCard';
import { Facility } from '@/app/components/FacilityCard';
import { useSearchParams } from 'next/navigation';

type FacilityFormValues = {
  type: string;
  roomname: string;
  capacity: number | string;
};

const validationSchema = Yup.object({
  type: Yup.string().required('Facility type is required'),
  roomname: Yup.string()
    .required('Room name is required')
    .matches(/^\d+$/, 'Room name must be numeric (e.g. 101, 202)'),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity cannot exceed 100'),
});

export default function CreateFacilityPage() {
  const [view, setView] = useState<'home' | 'form'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    const typeFilter = searchParams.get('type');

    if (typeFilter && facilities.length > 0) {
      const filtered = facilities.filter(
        (facility) => facility.type?.toLowerCase() === typeFilter.toLowerCase()
      );
      setFilteredFacilities(filtered);
      setFilter(typeFilter);

      window.history.replaceState({}, '', '/admin/facilities');
    } else {
      setFilteredFacilities(facilities);
    }
  }, [searchParams, facilities]);

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

  const handleSubmit = async (
    values: FacilityFormValues,
    { resetForm }: FormikHelpers<FacilityFormValues>
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, {
          ...values,
          capacity: Number(values.capacity),
        });
        setEditingFacility(null);
      } else {
        await createFacility({
          ...values,
          capacity: Number(values.capacity),
        });
      }
      await fetchFacilities();
      resetForm();
      setView('home');
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Failed to process facility'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    try {
      await deleteFacility(id);
      await fetchFacilities();
    } catch {
      alert('Failed to delete facility');
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setView('form');
  };

  const filteredFacilitiesBySearch = filteredFacilities.filter((facility) => {
    const matchType = filter === 'all' || facility.type === filter;
    const matchId = searchId === '' || facility.roomname.includes(searchId);
    return matchType && matchId;
  });

  return (
    <main>
      <Navbar variant='facility' />
      <Container className='!p-[30px]'>
        {view === 'home' && (
          <section className='flex flex-col items-center justify-center gap-4 text-center'>
            {/* Existing Facilities */}
            <section className='flex w-full flex-col gap-5'>
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
                      <li>
                        <button
                          className={`w-full px-4 py-2 text-left hover:bg-neutral-100 ${
                            filter === 'all' ? 'font-semibold' : ''
                          }`}
                          onClick={() => {
                            setFilter('all');
                            setShowFilter(false);
                          }}
                        >
                          All Types
                        </button>
                      </li>
                      <li>
                        <button
                          className={`w-full px-4 py-2 text-left hover:bg-neutral-100 ${
                            filter === 'classroom' ? 'font-semibold' : ''
                          }`}
                          onClick={() => {
                            setFilter('classroom');
                            setShowFilter(false);
                          }}
                        >
                          Classroom
                        </button>
                      </li>
                      <li>
                        <button
                          className={`w-full px-4 py-2 text-left hover:bg-neutral-100 ${
                            filter === 'laboratory' ? 'font-semibold' : ''
                          }`}
                          onClick={() => {
                            setFilter('laboratory');
                            setShowFilter(false);
                          }}
                        >
                          Laboratory
                        </button>
                      </li>
                      <li>
                        <button
                          className={`w-full px-4 py-2 text-left hover:bg-neutral-100 ${
                            filter === 'meeting' ? 'font-semibold' : ''
                          }`}
                          onClick={() => {
                            setFilter('meeting');
                            setShowFilter(false);
                          }}
                        >
                          Meeting
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Facility List */}
            <section className='w-full max-w-[575px] border-t border-neutral-400'>
              {loading ? (
                <p>Loading...</p>
              ) : fetchError ? (
                <p className='text-red-500'>{fetchError}</p>
              ) : (
                <div className='mt-4 grid w-full grid-cols-2 items-stretch gap-x-[12px] gap-y-[20px]'>
                  <aside className='h-[179px] w-full rounded-[25px] bg-gradient-to-b from-neutral-500 via-neutral-400 to-neutral-200 px-3 py-6 shadow-md shadow-neutral-500'>
                    <button
                      onClick={() => setView('form')}
                      className='flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 focus:outline-none'
                      aria-label='Create Facility'
                    >
                      <figure className='flex w-[144px] items-center justify-center'>
                        <Plus className='size-9' />
                      </figure>
                    </button>
                  </aside>
                  {filteredFacilitiesBySearch.map((facility) => (
                    <FacilityCard
                      key={facility.id}
                      facility={facility}
                      onEdit={() => handleEdit(facility)}
                      onDelete={() => handleDelete(facility.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </section>
        )}

        {view === 'form' && (
          <>
            {/* Breadcrumb */}
            <header className='mb-6'>
              <Breadcrumb className='w-full max-w-[575px]'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        setView('home');
                        setEditingFacility(null);
                        fetchFacilities();
                      }}
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {editingFacility ? 'Edit Facility' : 'Add Facility'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            {/* Form Section */}
            <section className='mx-auto flex w-full max-w-[575px] flex-col gap-5 rounded-[6px] border-2 border-neutral-400 px-7 py-6 text-black'>
              <header>
                <h1 className='lead'>
                  {editingFacility ? 'Edit Facility' : 'Add Facility'}
                </h1>
                <p className='small text-neutral-400'>
                  Provide the room name, type, and capacity.
                </p>
              </header>

              {error && (
                <div className='mb-4 rounded bg-red-100 p-4 text-black'>
                  {error}
                </div>
              )}

              <Formik<FacilityFormValues>
                enableReinitialize
                initialValues={{
                  type: editingFacility?.type ?? '',
                  roomname: editingFacility?.roomname ?? '',
                  capacity: editingFacility?.capacity ?? '',
                  // schedule: editingFacility?.schedule ?? '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form className='space-y-4 text-black'>
                    {/* Type */}
                    <fieldset className='flex flex-col gap-[2px]'>
                      <legend className='medium leading-6 text-black'>
                        Facility Type<span className='text-red-700'>*</span>
                      </legend>
                      <div className='mt-2 space-y-2'>
                        {['classroom', 'laboratory', 'meeting'].map((type) => (
                          <label key={type} className='flex items-center gap-2'>
                            <Field type='radio' name='type' value={type} />{' '}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name='type'
                        component='div'
                        className='text-sm text-red-600'
                      />
                    </fieldset>

                    {/* Roomname */}
                    <div className='flex flex-col gap-1'>
                      <label htmlFor='roomname' className='medium leading-6'>
                        Room Name <span className='text-red-700'>*</span>
                      </label>
                      <Field name='roomname'>
                        {({ field, meta }: FieldProps) => (
                          <input
                            {...field}
                            type='text'
                            id='roomname'
                            placeholder='Enter Room Name'
                            className={`mt-1 block w-full rounded border p-2 ${
                              meta.touched && meta.error
                                ? 'border-red-600'
                                : 'border-neutral-400'
                            }`}
                          />
                        )}
                      </Field>
                      <h1 className='subtle leading-3'>
                        Follow the naming format: 111, 123, 444
                      </h1>
                      <ErrorMessage
                        name='roomname'
                        component='div'
                        className='text-sm text-red-600'
                      />
                    </div>

                    {/* Capacity */}
                    <div className='flex flex-col gap-1'>
                      <label htmlFor='capacity' className='medium leading-6'>
                        Room Capacity <span className='text-red-700'>*</span>
                      </label>
                      <div className='flex items-center gap-3'>
                        <h1 className='small'>Capacity</h1>
                        <Field name='capacity'>
                          {({ field, meta }: FieldProps) => (
                            <input
                              {...field}
                              type='number'
                              id='capacity'
                              placeholder='0'
                              className={`h-[36px] w-[38px] [appearance:textfield] rounded-[6px] bg-white px-1 py-2 text-center text-[#171717] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                                meta.touched && meta.error
                                  ? 'border-red-600'
                                  : 'border-neutral-400'
                              } border`}
                            />
                          )}
                        </Field>
                      </div>
                      <h1 className='subtle leading-3'>
                        Enter Room Capacity (maximum of 100 persons)
                      </h1>
                      <ErrorMessage
                        name='capacity'
                        component='div'
                        className='text-sm text-red-600'
                      />
                    </div>

                    {/* Commented out schedule. Still in plan */}
                    {/* <div>
                        <label htmlFor='schedule' className='medium leading-6'>
                          Schedule (optional)
                        </label>
                        <Field
                          type='text'
                          id='schedule'
                          name='schedule'
                          className='mt-1 block w-full rounded border border-neutral-400 p-2'
                        />
                      </div> */}

                    <button
                      type='reset'
                      className='small rounded border border-neutral-900 px-4 py-2 transition-all duration-200 ease-in-out hover:bg-neutral-900 hover:text-white'
                    >
                      Reset
                    </button>

                    {/* Preview Card */}
                    <section className='flex flex-col items-center rounded-[6px] border border-neutral-400 bg-white py-6 text-center shadow'>
                      <div
                        className={`mx-auto flex w-[232px] flex-col rounded-[25px] px-3 py-6 leading-8 ${
                          values.type === 'classroom'
                            ? 'bg-classroom-card'
                            : values.type === 'laboratory'
                              ? 'bg-laboratory-card'
                              : values.type === 'meeting'
                                ? 'bg-meeting-card'
                                : 'bg-gradient-to-b from-neutral-500 via-neutral-400 to-neutral-200'
                        } gap-4 shadow-md shadow-neutral-500`}
                      >
                        <h3 className='leading-8 text-white uppercase'>
                          {values.type || 'Facility'}
                        </h3>
                        <hr className='w-full border-white' />
                        <div className='flex flex-col items-center gap-2'>
                          <h2 className='displayS leading-13 text-white'>
                            {values.roomname || '000'}
                          </h2>
                          <figure>
                            {values.type === 'classroom' && (
                              <Pencil className='size-14 text-white' />
                            )}
                            {values.type === 'laboratory' && (
                              <FlaskConical className='size-14 text-white' />
                            )}
                            {values.type === 'meeting' && (
                              <Subtitles className='size-14 text-white' />
                            )}
                            {!values.type && (
                              <Plus className='size-14 text-white' />
                            )}
                          </figure>
                        </div>
                        <p className='lead leading-7 text-white'>
                          CAPACITY: {values.capacity || 0}
                        </p>
                      </div>
                    </section>

                    {/* Buttons */}
                    <div className='mt-6 flex w-full justify-end gap-2'>
                      <div className='w-1/2'>
                        <button
                          onClick={() => {
                            setView('home');
                          }}
                          className='medium w-full rounded-[6px] border border-neutral-900 px-4 py-2 text-neutral-900 transition-all duration-200 ease-in-out hover:bg-neutral-900 hover:text-white disabled:opacity-50'
                        >
                          Cancel
                        </button>
                      </div>
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='medium bg-primary-900 hover:bg-primary-700 w-1/2 rounded-[6px] px-4 py-2 text-white transition-all duration-200 ease-in-out disabled:opacity-50'
                      >
                        {isSubmitting
                          ? editingFacility
                            ? 'Updating...'
                            : 'Creating...'
                          : editingFacility
                            ? 'Update'
                            : 'Add'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
          </>
        )}
      </Container>
    </main>
  );
}
