-- Add sample meditation to an existing mindfulness lesson
-- This is a reference SQL - adjust the lesson ID to match your database

-- First, check which lessons are available
-- SELECT id, title, category FROM lessons WHERE category = 'Mindfulness';

-- Update a lesson to include meditation (replace the ID with actual lesson ID)
UPDATE lessons
SET 
  is_meditation = true,
  meditation_audio_url = NULL, -- Add your audio URL here when ready
  content = '# Mindfulness and Mental Health

Welcome to this mindfulness practice. This lesson combines educational content with a guided meditation to help you develop awareness and reduce stress.

## Understanding Mindfulness

Mindfulness is the practice of being fully present in the moment, without judgment. It''s about observing your thoughts, feelings, and sensations as they arise, without getting caught up in them.

### Benefits of Mindfulness:

- **Reduces stress and anxiety** by breaking the cycle of rumination
- **Improves emotional regulation** helping you respond rather than react
- **Enhances focus and concentration** by training attention
- **Promotes better sleep** by calming an overactive mind
- **Increases self-awareness** leading to better decision-making

## The Mind-Body Connection

When you drink alcohol, it affects not just your body but your mental state. Mindfulness helps you:

1. **Recognize triggers** before they lead to drinking
2. **Pause and respond** instead of automatically reaching for a drink
3. **Process emotions** without numbing them
4. **Build resilience** to handle difficult feelings
5. **Find peace** without external substances

## Preparing for Your Meditation

To get the most from this practice:

### Environment:
- Find a quiet, comfortable space
- Sit or lie down - whatever feels good
- Use headphones if possible

### Mindset:
- There''s no "perfect" meditation
- Wandering mind is normal and expected
- Be kind and patient with yourself
- Even 5 minutes makes a difference

### What to Expect:
- You''ll be guided through breathing techniques
- Simple body awareness practices
- Grounding exercises to feel present
- Moments of silence for self-reflection

## Ready to Begin?

Below you''ll find your guided meditation. This is your time to pause, breathe, and reconnect with yourself. The practice is designed to help you build the mindfulness skills that support your sobriety journey.

Remember: Each time you practice, you''re strengthening your ability to be present and aware. This is a skill that will serve you in countless moments of your life.

---

*Take a moment when you''re ready, then click "Start Meditation" below.*',
  duration_minutes = 10
WHERE 
  category = 'Mindfulness'
  AND title ILIKE '%mindfulness%'
LIMIT 1;

-- Verify the update
SELECT 
  id, 
  title, 
  is_meditation, 
  meditation_audio_url,
  category
FROM lessons
WHERE is_meditation = true;

