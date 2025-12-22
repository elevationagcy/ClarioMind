-- Drop the user_settings trigger from user_profiles (it's causing the error)
DROP TRIGGER IF EXISTS create_user_settings_on_signup ON user_profiles;

-- Drop the function too
DROP FUNCTION IF EXISTS public.create_user_settings() CASCADE;

-- We can add user_settings table later if needed
-- For now, just focus on getting user registration working
