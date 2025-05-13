'use server';

import { createClient } from './server';

export async function createSchedule(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (
    userError ||
    !userData?.user ||
    userData.user.user_metadata?.role !== 'superuser'
  ) {
    throw new Error('Unauthorized: Only superusers can perform this action');
  }

  const facility_id = formData.get('facility_id') as string;
  const time_start = formData.get('time_start') as string;
  const time_end = formData.get('time_end') as string;
  const date_start = formData.get('date_start') as string;
  const date_end = formData.get('date_end') as string;
  const repeat_type = formData.get('repeat_type') as string;
  const repeat_dates = formData.get('repeat_dates') as string;
  const event = formData.get('event') as string;
  const faculty_in_charge = formData.get('faculty_in_charge') as string;
  const description = formData.get('description') as string | null;

  const { data, error } = await supabase
    .from('schedule')
    .insert([
      {
        facility_id,
        time_start,
        time_end,
        date_start,
        date_end,
        repeat_type,
        repeat_dates,
        event,
        faculty_in_charge,
        description,
      },
    ])
    .select();

  if (error) {
    console.error('Error inserting schedule:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function readSchedules() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('schedule')
    .select('*, facilities (roomname, type)')
    .order('date_start', { ascending: true });

  if (error) {
    console.error('Error fetching schedules:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateSchedule(id: number, formData: FormData) {
  const supabase = await createClient();

  const time_start = formData.get('time_start') as string;
  const time_end = formData.get('time_end') as string;
  const date_start = formData.get('date_start') as string;
  const date_end = formData.get('date_end') as string;
  const repeat_type = formData.get('repeat_type') as string;
  const repeat_dates = formData.get('repeat_dates') as string;
  const event = formData.get('event') as string;
  const faculty_in_charge = formData.get('faculty_in_charge') as string;
  const description = formData.get('description') as string | null;

  const { data, error } = await supabase
    .from('schedule')
    .update({
      time_start,
      time_end,
      date_start,
      date_end,
      repeat_type,
      repeat_dates,
      event,
      faculty_in_charge,
      description,
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating schedule:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteSchedule(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from('schedule').delete().eq('id', id);

  if (error) {
    console.error('Error deleting schedule:', error);
    throw new Error(error.message);
  }
}
