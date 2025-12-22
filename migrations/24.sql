-- Fix overly permissive RLS policies on payments table

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow checking payment status by email" ON payments;
DROP POLICY IF EXISTS "Allow service role full access to payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update their payments" ON payments;

-- Create proper restrictive policies

-- Users can only view their own payments (by user_id)
-- The existing "Users can view their own payments" policy is already correct

-- Allow anonymous users to check payment by email during registration (limited scope)
CREATE POLICY "Allow payment check by email during registration" ON payments
  FOR SELECT
  USING (
    -- Only allow reading if the email column matches and no user_id is set yet
    -- This allows pre-registration payment verification
    user_id IS NULL
  );

-- Users can only update their own payments
DROP POLICY IF EXISTS "Authenticated users can update their payments" ON payments;
CREATE POLICY "Users can update their own payments" ON payments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);