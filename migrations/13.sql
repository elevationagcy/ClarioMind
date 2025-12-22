-- Add role column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Make first user admin (update with your user email)
-- This is commented out - you'll need to run manually with the correct email
-- UPDATE user_profiles SET role = 'admin' 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com' LIMIT 1);

COMMENT ON COLUMN user_profiles.role IS 'User role: user or admin';
