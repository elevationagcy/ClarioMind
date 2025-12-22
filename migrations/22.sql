-- Add column to store when subscription access ends
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;

-- Add same column to user_profiles for easy access
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;