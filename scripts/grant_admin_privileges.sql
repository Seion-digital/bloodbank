-- Update a user to have admin privileges.
-- Replace 'user_email@example.com' with the email of the user you want to make an admin.
UPDATE public.users
SET user_type = 'admin'
WHERE email = 'user_email@example.com';
