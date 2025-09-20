-- This script creates a new admin user and grants them full privileges.
-- After running this script, you MUST set the password for this user manually in the Supabase dashboard.

-- 1. Insert the new user into auth.users
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_sent_at, confirmed_at)
VALUES (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- Pre-defined UUID for the admin user
    'authenticated',
    'authenticated',
    'seion.automation.services@gmail.com',
    'PASSWORD_NEEDS_TO_BE_SET_MANUALLY', -- IMPORTANT: This is not a valid hash.
    now(),
    '',
    NULL,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    NULL,
    now()
);

-- 2. Insert the user's profile into public.users
INSERT INTO public.users (id, email, phone, full_name, date_of_birth, gender, blood_type, weight, medical_conditions, district_id, club_name, member_id, user_type, verification_status, address, city, state, coordinates, emergency_contact, preferred_hospital, last_donation_date, total_donations, created_at, is_active, profile_image)
VALUES (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- Must match the UUID from auth.users
    'seion.automation.services@gmail.com',
    '1234567890',
    'Admin',
    '1990-01-01',
    'Male',
    'O+',
    75,
    'None',
    (SELECT id FROM districts LIMIT 1), -- Assign to the first available district
    'Admin Club',
    'ADMIN001',
    'admin',
    'verified',
    '123 Admin Street',
    'Admin City',
    'Admin State',
    POINT(12.9716, 77.5946),
    '0987654321',
    'Admin Hospital',
    '2023-01-01',
    0,
    now(),
    true,
    ''
);

-- 3. Grant admin privileges (this part should already be in your setup.sql, but is included for completeness)
-- Note: The is_admin() function and the admin policies should be created first.
-- This part of the script assumes they already exist.

-- This is just a comment to remind the user that the RLS policies are what grant the admin privileges.
-- No further action is needed here if the policies are already in place.
