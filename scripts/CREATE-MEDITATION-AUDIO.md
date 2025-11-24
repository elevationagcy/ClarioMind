# 🎙️ Creating Meditation Audio Files

This guide will help you convert the meditation narrations into high-quality MP3 audio files.

---

## Option 1: ElevenLabs (Recommended)

**Best for:** Natural, human-like voices with emotion

### Steps:

1. **Sign up:** https://elevenlabs.io
   - Free tier: 10,000 characters/month
   - Paid: $5/month for 30,000 characters

2. **Choose a voice:**
   - **Bella** - Warm, calming female voice
   - **Josh** - Gentle, reassuring male voice
   - **Antoni** - Neutral, professional
   - Or clone your own voice!

3. **Settings:**
   - Stability: 60-70% (natural variability)
   - Clarity: 70-80% (clear but not robotic)
   - Style: 0-20% (subtle, not dramatic)

4. **Generate:**
   ```
   - Copy narration text from meditation-narrations.md
   - Paste into ElevenLabs
   - Click "Generate"
   - Download as MP3
   ```

5. **Add background:**
   - Use Audacity (free) to layer ambient sounds
   - Background music at 20-30% volume

---

## Option 2: Google Cloud Text-to-Speech

**Best for:** Free, good quality, many language options

### Setup:

```bash
# Install gcloud CLI
brew install google-cloud-sdk

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Create Script:

```bash
#!/bin/bash

# Set variables
TEXT_FILE="meditation-narrations/grounding.txt"
OUTPUT_FILE="grounding.mp3"
VOICE="en-US-Neural2-F"  # Female, natural
SPEAKING_RATE=0.85  # Slightly slower

# Generate audio
gcloud text-to-speech synthesize-text \
  --text-file="$TEXT_FILE" \
  --output="$OUTPUT_FILE" \
  --voice-name="$VOICE" \
  --speaking-rate=$SPEAKING_RATE \
  --pitch=0 \
  --audio-encoding=mp3

echo "✅ Created $OUTPUT_FILE"
```

### Best Voices:

- `en-US-Neural2-F` - Warm female
- `en-US-Neural2-I` - Calm male
- `en-US-Neural2-J` - Gentle neutral
- `en-GB-Neural2-A` - British female (soothing)

### Pricing:

- First 1 million characters: FREE per month
- After: $16 per 1 million characters

---

## Option 3: Amazon Polly

**Best for:** Integration with AWS, consistent quality

### Setup:

```bash
# Install AWS CLI
brew install awscli

# Configure
aws configure
```

### Create Script:

```bash
#!/bin/bash

# Convert text to speech
aws polly synthesize-speech \
  --text-type text \
  --text file://meditation-narrations/grounding.txt \
  --voice-id Joanna \
  --engine neural \
  --output-format mp3 \
  grounding.mp3

echo "✅ Created grounding.mp3"
```

### Best Voices:

- **Joanna** - Professional, clear female
- **Matthew** - Warm, trustworthy male
- **Ivy** - Gentle, youthful female
- **Ruth** - British, soothing female

### Pricing:

- Neural voices: $16 per 1 million characters
- First 12 months AWS Free Tier: 5 million characters/month

---

## Adding Background Music & Sounds

### Using Audacity (Free)

1. **Download Audacity:** https://audacityteam.org

2. **Import narration:**
   - File → Import → Audio
   - Select your TTS-generated MP3

3. **Add background:**
   - File → Import → Audio
   - Select ambient music/sounds

4. **Adjust levels:**
   - Select background track
   - Effect → Amplify → Reduce to -20dB to -25dB
   - Narration should be clear and prominent

5. **Add fade in/out:**
   - Select first 5 seconds of background
   - Effect → Fade In
   - Select last 10 seconds
   - Effect → Fade Out

6. **Export:**
   - File → Export → Export as MP3
   - Quality: 128 kbps (good balance)
   - Click "Export"

---

## Recommended Background Music Sources

### Free Options:

1. **Incompetech** - https://incompetech.com
   - Search: "ambient", "meditation", "calm"
   - Free with attribution

2. **Purple Planet** - https://www.purple-planet.com
   - Royalty-free ambient music
   - No attribution needed

3. **Free Music Archive** - https://freemusicarchive.org
   - Filter by "Ambient" genre
   - Check license (Creative Commons)

### Paid Options:

1. **Epidemic Sound** - $15/month
   - Huge library of meditation music
   - Commercial use included

2. **Artlist** - $299/year
   - High-quality, unlimited downloads
   - Perpetual license

### Specific Recommendations:

- **"Weightless" by Marconi Union** (Licensed)
- **432 Hz Pure Tone** (Royalty-free)
- **Tibetan Singing Bowls** (Many free versions)
- **Nature Sounds:** Rain, ocean waves, forest

---

## Audio Specifications

### For Web Playback:

```
Format: MP3
Bitrate: 128 kbps (good quality, ~1MB per minute)
Sample Rate: 44.1 kHz
Channels: Stereo
Normalization: -3dB peak
```

### File Size Estimates:

- 5 min meditation: ~5 MB
- 10 min meditation: ~10 MB
- 12 min meditation: ~12 MB

---

## Uploading to Supabase

### 1. Create Storage Bucket:

```sql
-- In Supabase dashboard → Storage → Create bucket
-- Name: meditation-audio
-- Public: true
```

### 2. Upload via Dashboard:

1. Go to Storage → meditation-audio
2. Click "Upload file"
3. Select your MP3 files
4. Upload

### 3. Get Public URLs:

After upload, click the file and copy the public URL:

```
https://[your-project].supabase.co/storage/v1/object/public/meditation-audio/grounding.mp3
```

### 4. Update Database:

```sql
UPDATE lessons
SET meditation_audio_url = 'https://[your-project].supabase.co/storage/v1/object/public/meditation-audio/grounding.mp3'
WHERE title = 'Introduction to Mindfulness';
```

---

## Quick Start Script

Save this as `generate-all-meditations.sh`:

```bash
#!/bin/bash

# Array of meditations
declare -a meditations=(
  "grounding:10"
  "breath-awareness:8"
  "self-compassion:12"
  "stress-release:10"
)

# Loop through and generate
for meditation in "${meditations[@]}"; do
  IFS=':' read -r name duration <<< "$meditation"
  
  echo "🎙️ Generating $name meditation..."
  
  # Using Google Cloud TTS (adjust for your chosen service)
  gcloud text-to-speech synthesize-text \
    --text-file="meditation-narrations/$name.txt" \
    --output="audio/$name.mp3" \
    --voice-name="en-US-Neural2-F" \
    --speaking-rate=0.85 \
    --audio-encoding=mp3
  
  echo "✅ Created $name.mp3 ($duration minutes)"
done

echo "🎉 All meditations generated!"
echo "📁 Files are in the audio/ directory"
echo "📤 Next: Add background music and upload to Supabase"
```

Make executable and run:

```bash
chmod +x generate-all-meditations.sh
./generate-all-meditations.sh
```

---

## Testing Your Audio

Before uploading:

### Quality Checklist:

- [ ] Narration is clear and audible
- [ ] Background music doesn't overpower voice
- [ ] No clipping or distortion
- [ ] Smooth fade in/out
- [ ] Consistent volume throughout
- [ ] Total duration matches expected length
- [ ] File size is reasonable (< 15MB)

### Test Playback:

- [ ] Desktop browser (Chrome, Safari, Firefox)
- [ ] Mobile browser (iOS Safari, Android Chrome)
- [ ] With headphones
- [ ] With phone speakers
- [ ] At different volume levels

---

## Example: Complete Workflow

```bash
# 1. Extract narration to text file
cat meditation-narrations.md | \
  sed -n '/## 1. Grounding Meditation/,/## 2. Breath Awareness/p' | \
  grep -v '^##' | \
  grep -v '^\*\[' > grounding.txt

# 2. Generate audio with Google TTS
gcloud text-to-speech synthesize-text \
  --text-file="grounding.txt" \
  --output="grounding-voice.mp3" \
  --voice-name="en-US-Neural2-F" \
  --speaking-rate=0.85

# 3. Open Audacity
# - Import grounding-voice.mp3
# - Import background-music.mp3
# - Adjust levels (background to -23dB)
# - Add fades
# - Export as grounding-final.mp3

# 4. Upload to Supabase via dashboard

# 5. Update database
psql $DATABASE_URL -c "UPDATE lessons SET meditation_audio_url = 'https://...' WHERE ..."

# Done! 🎉
```

---

## Troubleshooting

### Audio sounds robotic:
- Reduce speaking rate (0.75-0.85 is best)
- Use Neural voices (not Standard)
- Try different voice options

### Background too loud:
- Reduce to -25dB or lower
- Use gentler ambient sounds
- Ensure narration is normalized

### File too large:
- Export at 96-128 kbps (not 320)
- Use mono instead of stereo
- Compress with online tools

### Meditation too short/long:
- Adjust pauses in narration text
- Add more silence between sections
- Slow down speaking rate

---

Your meditations are ready to bring peace to your users! 🧘‍♀️✨

