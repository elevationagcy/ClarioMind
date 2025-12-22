-- Add billing interval and next billing date columns to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS billing_interval_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS next_billing_date timestamptz;