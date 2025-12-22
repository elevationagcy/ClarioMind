
-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  icon TEXT,
  duration_days INTEGER DEFAULT 30,
  participants_count INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create tips table
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  coach_name TEXT,
  icon TEXT,
  category TEXT,
  duration_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- Add public read policies
CREATE POLICY "Allow public read access to challenges"
ON challenges
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to tips"
ON tips
FOR SELECT
TO public
USING (true);

COMMENT ON TABLE challenges IS 'Guided challenges for users to participate in';
COMMENT ON TABLE tips IS 'Tips and advice from coaches';
