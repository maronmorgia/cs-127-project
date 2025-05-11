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
  Trash2,
  Edit2,
} from 'lucide-react';
import Link from 'next/link';

type Facility = {
  id: number;
  type: string;
  roomname: string;
  capacity: number;
  // schedule?: string;
};

type FacilityFormValues = {
  type: string;
  roomname: string;
  capacity: number | string;
  // schedule?: string;
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
  // schedule: Yup.string().optional(),
});

export default function CreateFacilityPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

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
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchType = filter === 'all' || facility.type === filter;
    const matchId = searchId === '' || facility.id.toString() === searchId;
    return matchType && matchId;
  });

  return (
    <main>
      <Navbar />
      <Container className='!p-[30px]'>
        {/* Breadcrumb */}
        <header className='mb-6'>
          <Breadcrumb className='w-full max-w-[575px]'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
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
                  <Link href='/facility' className='w-1/2'>
                    <button className='medium w-full rounded-[6px] border border-neutral-900 px-4 py-2 text-neutral-900 transition-all duration-200 ease-in-out hover:bg-neutral-900 hover:text-white disabled:opacity-50'>
                      Cancel
                    </button>
                  </Link>
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

          <section className='my-6 flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='w-full md:w-auto'>
              <label
                htmlFor='filter'
                className='mb-1 block text-sm font-medium text-neutral-700'
              >
                Filter by Type
              </label>
              <select
                id='filter'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm md:w-48'
              >
                <option value='all'>All Types</option>
                <option value='classroom'>Classroom</option>
                <option value='laboratory'>Laboratory</option>
                <option value='meeting'>Meeting</option>
              </select>
            </div>

            <div className='w-full md:w-auto'>
              <label
                htmlFor='searchId'
                className='mb-1 block text-sm font-medium text-neutral-700'
              >
                Search by ID
              </label>
              <input
                type='text'
                id='searchId'
                placeholder='Enter ID'
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className='w-full rounded-md border border-neutral-300 px-3 py-2 text-sm md:w-64'
              />
            </div>
          </section>

          {/* Facility List */}
          <div>
            <h2 className='text-xl font-semibold'>Existing Facilities</h2>
            {loading ? (
              <p>Loading...</p>
            ) : fetchError ? (
              <p className='text-red-500'>{fetchError}</p>
            ) : (
              <ul className='mt-4 space-y-2'>
                {filteredFacilities.map((facility) => (
                  <li
                    key={facility.id}
                    className='flex items-center justify-between rounded border p-3 shadow-sm'
                  >
                    <div>
                      <strong>{facility.type.toUpperCase()}</strong> — Room{' '}
                      {facility.roomname} (Cap: {facility.capacity})
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(facility)}
                        className='text-primary-700 hover:underline'
                      >
                        <Edit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(facility.id)}
                        className='text-secondary-700 hover:underline'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
