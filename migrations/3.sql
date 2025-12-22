-- Create enum types for drinking patterns
CREATE TYPE interference_frequency_type AS ENUM ('always', 'often', 'sometimes');
CREATE TYPE drink_intention_frequency_type AS ENUM ('often', 'sometimes', 'never');

-- Create drinking_patterns table
CREATE TABLE drinking_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  drinks_per_week INTEGER,
  spend_per_week NUMERIC(10, 2),
  alcohol_types TEXT[],
  drinking_times TEXT[],
  drinking_reasons TEXT[],
  interference_frequency interference_frequency_type,
  drink_more_than_intended drink_intention_frequency_type,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drinking_patterns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own patterns"
  ON drinking_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patterns"
  ON drinking_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns"
  ON drinking_patterns FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);