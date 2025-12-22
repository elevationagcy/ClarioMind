-- Add meditation audio URL to lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS meditation_audio_url TEXT,
ADD COLUMN IF NOT EXISTS is_meditation BOOLEAN DEFAULT false;

-- Update existing mindfulness lessons to mark them as meditations
UPDATE lessons
SET is_meditation = true
WHERE category IN ('Mindfulness', 'Mental Health')
AND id IN (
  SELECT id FROM lessons
  WHERE category IN ('Mindfulness', 'Mental Health')
  ORDER BY "order"
  LIMIT 5
);

COMMENT ON COLUMN lessons.meditation_audio_url IS 'URL to the meditation audio file (MP3)';
COMMENT ON COLUMN lessons.is_meditation IS 'Whether this lesson includes a guided meditation';