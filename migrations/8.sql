-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create a more permissive insert policy that allows authenticated users to create their profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);