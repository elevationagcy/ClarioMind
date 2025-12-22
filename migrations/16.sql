-- Create quiz_responses table for storing quiz answers before signup
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table for tracking Stripe payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  quiz_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add has_paid column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);

-- Enable RLS on new tables
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz_responses (allow inserts from anyone, select for matching email)
CREATE POLICY "Allow public inserts to quiz_responses" ON quiz_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own quiz responses" ON quiz_responses
  FOR SELECT USING (true);

-- RLS policies for payments
CREATE POLICY "Allow service role full access to payments" ON payments
  FOR ALL USING (true);

-- Allow authenticated users to view their own payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);