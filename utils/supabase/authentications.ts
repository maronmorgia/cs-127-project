'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from './server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error:
        error.message.includes('Invalid login credentials') ||
        error.message.includes('Invalid login')
          ? 'Incorrect email or password'
          : error.message,
    };
  }

  return { error: '' };
}

export async function loginWithFormState(
  _: { error: string } | undefined,
  formData: FormData
) {
  const result = await login(formData);
  return result || { error: '' };
}

export async function loginAction(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  return await login(formData);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}

export const signWithGoogle = async () => {
  const supabase = await createClient();
  const originUrl = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${originUrl}/auth/callback`,
      queryParams: {
        hd: 'up.edu.ph',
      },
    },
  });

  if (data.url) {
    revalidatePath('/', 'layout');
    redirect(data.url);
  }

  if (error) {
    console.error('Error signing in with Google:', error.message);
    redirect(`/error?error=${error.message}`);
  }
};

// Function to handle password change
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  // Extract values inputted into the form
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Makes sure that all input fields are filled
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  // Makes sure that both values match
  if (newPassword !== confirmPassword) {
    return { error: 'New password and confirm password do not match.' };
  }

  // Validation so that the password must include at least one letter and one number
  // Should not be lesser than 8 characters
  if (
    newPassword.length < 8 ||
    !/[a-zA-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
  ) {
    return {
      error:
        'Password must be at least 8 characters long and include a letter and a number.',
    };
  }

  // Securely get the user object using supabase.auth.getUser()
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return { error: 'Unable to retrieve user data from Supabase.' };
  }

  const user = data?.user; // Access the user object here

  if (!user) {
    return { error: 'User not authenticated.' };
  }

  // Ensures that users entered their password correctly
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email!, // Access the email here
    password: currentPassword,
  });

  // If the current password is incorrect show error
  if (reauthError) return { error: 'Current password is incorrect.' };

  // Update the user's password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  // Handle possible Supabase error
  if (updateError) return { error: updateError.message };

  // Return success message if everything went well
  return { success: 'Password updated successfully.' };
}

