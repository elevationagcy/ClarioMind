-- Create enum types for goals
CREATE TYPE alcohol_goal_type AS ENUM ('quit', 'cut_back', 'stay_sober', 'not_sure');
CREATE TYPE regret_frequency_type AS ENUM ('always', 'often', 'somewhat_often', 'never');

-- Create user_goals table
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tried_quit_before BOOLEAN,
  reasons TEXT[],
  alcohol_relationship_goal alcohol_goal_type,
  regret_frequency regret_frequency_type,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own goals"
  ON user_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON user_goals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);