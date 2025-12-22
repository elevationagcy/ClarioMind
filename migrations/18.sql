-- Add stripe_customer_id column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
