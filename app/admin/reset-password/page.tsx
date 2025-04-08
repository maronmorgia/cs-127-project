'use client'

import { useState } from "react"
import { updatePassword } from "@/utils/supabase/authentications"

export default function ChangePasswordForm() {
    // Stores status feedback message and styles accordingly *suggest ni gpt*
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'error' | 'success' | ''>('');

    // Local state to manage visibility of password fields
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle form submission
    // Prevents reload page
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        // Collect form data from the form element
        const formData = new FormData(e.currentTarget);

        // Call the server action to update the password
        const result = await updatePassword(formData);

        // If there's an error, show this error message
        if (result?.error) {
            setMessage(result.error || 'An error occurred');
            setStatus('error');
        } else {
            // If success, shows success message
            setMessage(result.success || 'Password updated');
            setStatus('success');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {/* Input for current password */}
            {/* Current Password Field */}
            <div>
                <input
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'} // Show or hide password based on state
                    placeholder="Current Password"
                    required
                    className="input"
                />
                {/* Button to toggle visibility of current password */}
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} // Toggle visibility state
                    className="text-sm text-blue-500"
                >
                    {showCurrentPassword ? 'Hide' : 'Show'} {/* Button text changes based on state */}
                </button>
            </div>

            {/* New Password Field */}
            <div>
                <input
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'} // Show or hide password based on state
                    placeholder="New Password"
                    required
                    className="input"
                />
                {/* Button to toggle visibility of new password */}
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility state
                    className="text-sm text-blue-500"
                >
                    {showNewPassword ? 'Hide' : 'Show'} {/* Button text changes based on state */}
                </button>
            </div>

            {/* Confirm New Password Field */}
            <div>
                <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'} // Show or hide password based on state
                    placeholder="Confirm New Password"
                    required
                    className="input"
                />
                {/* Button to toggle visibility of confirm password */}
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility state
                    className="text-sm text-blue-500"
                >
                    {showConfirmPassword ? 'Hide' : 'Show'} {/* Button text changes based on state */}
                </button>
            </div>

            {/* Submit Button to update the password */}
            <button type="submit" className="btn">
                Update Password
            </button>

            {/* Message displayed below the form */}
            {message && (
                <p className={status === 'error' ? 'text-red-500' : 'text-green-500'}>
                    {message} {/* Display success or error message */}
                </p>
            )}
        </form>
    );
}
