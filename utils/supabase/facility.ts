'use server';

import { createClient } from './server';

type FacilityInput = {
  type: string;
  roomname: string;
  capacity: number;
  // schedule?: string;
};

export async function createFacility(data: FacilityInput) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (
    userError ||
    !userData?.user ||
    userData.user.user_metadata?.role !== 'superuser'
  ) {
    throw new Error('Unauthorized: Only superusers can perform this action');
  }

  const { type, roomname, capacity /*, schedule */ } = data;

  const { data: result, error } = await supabase
    .from('facilities')
    .insert([{ type, roomname, capacity }])
    .select();

  if (error) {
    console.error('Error inserting facility:', error);
    throw new Error(error.message);
  }

  console.log('Facility created successfully:', result);
  return result;
}

export async function readFacilities() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching facilities:', error);
    throw new Error(error.message);
  }

  console.log('Facilities fetched successfully:', data);
  return data;
}

export async function updateFacility(
  id: number,
  values: {
    type: string;
    roomname: string;
    capacity: number;
    // schedule?: string;
  }
) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (
    userError ||
    !userData?.user ||
    userData.user.user_metadata?.role !== 'superuser'
  ) {
    throw new Error('Unauthorized: Only superusers can perform this action');
  }

  const { type, roomname, capacity /*, schedule */ } = values;

  const { data, error } = await supabase
    .from('facilities')
    .update({ type, roomname, capacity })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating facility:', error);
    throw new Error(error.message);
  }

  console.log('Facility updated successfully:', data);
  return data;
}

export async function deleteFacility(id: number) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (
    userError ||
    !userData?.user ||
    userData.user.user_metadata?.role !== 'superuser'
  ) {
    throw new Error('Unauthorized: Only superusers can perform this action');
  }

  const { error } = await supabase.from('facilities').delete().eq('id', id);

  if (error) {
    console.error('Error deleting facility:', error);
    throw new Error(error.message);
  }

  console.log('Facility deleted successfully');
  return { success: true };
}
