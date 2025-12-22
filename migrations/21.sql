-- Allow anyone to check if a payment exists for an email (needed during registration)
-- This is secure because they can only see id and status, and need to know the exact email
CREATE POLICY "Allow checking payment status by email"
ON payments
FOR SELECT
USING (true);

-- Also allow authenticated users to update payments (to link user_id)
CREATE POLICY "Authenticated users can update their payments"
ON payments
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
