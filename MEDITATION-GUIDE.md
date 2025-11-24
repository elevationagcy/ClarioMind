# 🧘 Meditation Feature Guide

## Overview

The Reframe app now includes a fully-featured meditation system with:
- ✅ 4 professional meditation narrations (10-12 minutes each)
- ✅ Animated gradient meditation player
- ✅ Breathing visualizations
- ✅ Audio playback with progress tracking
- ✅ Database integration

---

## 📝 Meditation Narrations Created

All narration scripts are in `/meditation-narrations.md`:

1. **Grounding Meditation** (10 minutes)
   - 5-4-3-2-1 grounding technique
   - Body scan
   - Root visualization
   - Perfect for anxiety and overwhelm

2. **Breath Awareness Meditation** (8 minutes)
   - Simple breath focus
   - Anchor point awareness
   - Building mindfulness muscle
   - Great for beginners

3. **Self-Compassion Meditation** (12 minutes)
   - Heart-centered practice
   - Compassionate phrases
   - Self-love and acceptance
   - Ideal for self-criticism

4. **Stress Release Meditation** (10 minutes)
   - Tension release
   - Worry bubble visualization
   - Letting go practice
   - Perfect for stress relief

---

## 🎵 Creating Audio Files

### Steps to Create MP3s:

1. **Choose a narrator:**
   - Use a text-to-speech service (ElevenLabs, Google Cloud TTS)
   - Or record with a professional voice actor
   - Recommended voices: Calm, warm, gender-neutral

2. **Add background music:**
   - 432 Hz ambient soundscapes
   - Nature sounds (rain, ocean, forest)
   - Tibetan singing bowls
   - Keep music 20-30% volume of narration

3. **Audio settings:**
   - Format: MP3
   - Bitrate: 128 kbps (good quality, small file)
   - Sample rate: 44.1 kHz
   - Normalize audio to -3dB

4. **Export and upload:**
   - Export each meditation as separate MP3
   - Upload to Supabase Storage:
     ```bash
     # Create 'meditation-audio' bucket in Supabase
     # Upload files: grounding.mp3, breath-awareness.mp3, etc.
     ```

---

## 🗄️ Database Setup

### Migration Applied:

```sql
ALTER TABLE lessons
ADD COLUMN meditation_audio_url TEXT,
ADD COLUMN is_meditation BOOLEAN DEFAULT false;
```

### Update a Lesson with Meditation:

```sql
UPDATE lessons
SET 
  is_meditation = true,
  meditation_audio_url = 'https://[your-supabase-project].supabase.co/storage/v1/object/public/meditation-audio/grounding.mp3'
WHERE 
  title = 'Mindfulness Practice' -- or any mindfulness lesson
  AND category = 'Mindfulness';
```

---

## 🎨 Meditation Player Features

### Visual Elements:

1. **Animated Gradients** (8 themes)
   - Purple → Pink → Blue → Green → Sunset...
   - Smoothly transitions every 30 seconds
   - Creates calming, immersive atmosphere

2. **Breathing Circle**
   - Pulses in/out (8 second cycle)
   - Visual breathing guide
   - Syncs with meditation pace

3. **Floating Particles**
   - 20 subtle particles
   - Slow, random movement
   - Adds depth without distraction

4. **Breathing Text**
   - "Breathe" fades in/out
   - 8 second cycle
   - Gentle reminder

### Controls:

- ▶️ Play/Pause button (center, large)
- 🔊 Mute/Unmute (bottom)
- ⏱️ Progress bar with time display
- ❌ Close button (top-right)

### User Experience:

- **Fullscreen immersion** - Takes over entire screen
- **Audio controls** - Simple, intuitive playback
- **Progress tracking** - See how far through meditation
- **Smooth animations** - 60fps Framer Motion
- **Responsive** - Works on mobile and desktop

---

## 💻 Implementation

### Components Created:

1. **`MeditationPlayer`** (`components/meditation/meditation-player.tsx`)
   - Fullscreen meditation experience
   - Audio playback management
   - Animated gradients and visualizations

2. **`MeditationLesson`** (`app/dashboard/lesson/[id]/meditation-lesson.tsx`)
   - Beautiful meditation card
   - "Start Meditation" button
   - Integrates into lesson flow

### Integration:

The meditation player automatically appears in lessons that have:
```typescript
{
  is_meditation: true,
  meditation_audio_url: "https://..."
}
```

No additional code needed - it's fully integrated!

---

## 🚀 Usage Flow

1. **User opens a mindfulness lesson**
   - Sees regular lesson content first
   - Below content: Beautiful meditation card appears

2. **User clicks "Start Meditation"**
   - Screen transforms to fullscreen gradient
   - Audio starts playing
   - Breathing visualizations begin

3. **During meditation:**
   - User sees breathing circle pulse
   - Gradients slowly transition
   - "Breathe" text fades in/out
   - Progress bar shows time remaining

4. **After meditation:**
   - User clicks X to close
   - Returns to lesson to complete quizzes
   - Marks lesson as complete

---

## 📊 Example: Adding Meditation to a Lesson

```sql
-- 1. Find a mindfulness lesson
SELECT id, title FROM lessons 
WHERE category = 'Mindfulness' 
LIMIT 1;

-- 2. Update it with meditation
UPDATE lessons
SET 
  is_meditation = true,
  meditation_audio_url = 'https://mjjnhqnotroomixljxdc.supabase.co/storage/v1/object/public/meditation-audio/grounding.mp3',
  content = 'This lesson includes a guided meditation practice to help you develop mindfulness and reduce stress through focused awareness and breathing techniques.

## What You''ll Learn

In this meditation, you''ll practice:

- **Grounding techniques** using the 5-4-3-2-1 method
- **Body scan** awareness to release tension  
- **Root visualization** for stability and calm
- **Present moment** awareness

## Benefits

Regular meditation practice can:

- Reduce anxiety and stress
- Improve focus and concentration
- Enhance emotional regulation
- Promote better sleep
- Increase self-awareness

Take a few minutes to find a comfortable, quiet space. You can sit or lie down - whatever feels most relaxing for you.'
WHERE 
  id = 'your-lesson-id-here';
```

---

## 🎯 Best Practices

### For Audio Production:

1. **Pacing:** Speak slowly, allow pauses
2. **Tone:** Warm, accepting, non-judgmental  
3. **Volume:** Narration 70%, background 30%
4. **Quality:** Professional recording environment
5. **Testing:** Listen multiple times before finalizing

### For User Experience:

1. **Set expectations:** Tell users duration upfront
2. **Provide tips:** Suggest headphones, quiet space
3. **Allow flexibility:** Users can pause anytime
4. **Track progress:** Save completion in database
5. **Encourage practice:** Remind users they can return

---

## 🔮 Future Enhancements

Potential additions:

- [ ] Multiple meditations per lesson
- [ ] Custom meditation playlists
- [ ] Meditation history/stats
- [ ] Favorite meditations
- [ ] Adjustable background sounds
- [ ] Offline audio download
- [ ] Meditation reminders
- [ ] Breathing rate customization
- [ ] Achievement badges for meditation streaks

---

## 📱 Mobile Optimization

The meditation player is fully mobile-optimized:

- ✅ Responsive sizing
- ✅ Touch controls
- ✅ Portrait/landscape support
- ✅ Background audio (when app is in background)
- ✅ Fullscreen immersion
- ✅ Smooth animations on lower-end devices

---

## 🎨 Gradient Themes

1. **Purple Haze** - Calm and contemplative
2. **Pink Sunset** - Warm and nurturing
3. **Ocean Blue** - Cool and refreshing
4. **Healing Green** - Balanced and grounded
5. **Golden Sunset** - Energizing and hopeful
6. **Deep Ocean** - Mysterious and profound
7. **Soft Pastel** - Gentle and soothing
8. **Warm Embrace** - Comforting and safe

Each theme transitions smoothly every 30 seconds for a dynamic yet calming experience.

---

## ✅ Quality Checklist

Before publishing meditation audio:

- [ ] Audio is clear and free of background noise
- [ ] Volume is consistent throughout
- [ ] Pacing allows for natural pauses
- [ ] Background music complements narration
- [ ] Total duration matches lesson duration
- [ ] File is optimized (< 10MB for 10 min)
- [ ] Tested on mobile and desktop
- [ ] Accessible to users with headphones off

---

## 🙏 Credits

- **Narrations:** Custom-written for Reframe
- **Animation:** Framer Motion
- **Audio:** HTML5 Audio API
- **Gradients:** CSS gradients with smooth transitions
- **Design:** Inspired by Calm, Headspace, Insight Timer

---

Your meditation feature is ready to help users find peace and mindfulness! 🧘‍♀️✨

