# AI Image Generation for Lessons

This script automatically generates professional icons for all lessons using AI and uploads them to Supabase Storage.

## Setup

### 1. Get OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create an account or log in
3. Generate a new API key
4. Add to your `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 2. Install Dependencies

Make sure you have `node-fetch` installed:

```bash
npm install node-fetch
```

## Usage

### Generate Images for All Lessons

```bash
cd /Users/lukamindek/Desktop/reframe
node scripts/generate-lesson-images.js
```

### What it Does

1. **Fetches all lessons** from Supabase that need images (have emoji or no icon)
2. **Generates AI images** using Gemini 2.5 Flash Image Preview via OpenRouter
3. **Uploads to Supabase Storage** in the `images/lessons/generated/` folder
4. **Updates database** with the new image URLs
5. **Rate limits** requests (2 seconds between each) to avoid API throttling

### Features

- ✅ Automatic prompt generation based on lesson title, category, and content
- ✅ Professional, minimalist, flat design style
- ✅ Suitable for mobile app UI
- ✅ No text in images (just visual symbols)
- ✅ Proper error handling and retry logic
- ✅ Temp files saved for debugging
- ✅ Progress logging

### Cost Estimation

OpenRouter charges per API call. Gemini 2.5 Flash Image Preview costs vary:
- ~$0.01-0.05 per image generation
- For 30 lessons: ~$0.30-1.50 total

Check current pricing: https://openrouter.ai/models/google/gemini-2.5-flash-image-preview

### Output

Generated images will be stored at:
- **Supabase**: `https://[project].supabase.co/storage/v1/object/public/images/lessons/generated/day-X-lesson-name.png`
- **Temp Local**: `./temp-images/day-X.png` (for debugging)

### Example Run

```
🚀 Starting AI image generation for lessons...

📚 Found 30 lessons

🎯 20 lessons need AI-generated images

━━━ Day 1: Welcome to Your Journey ━━━
Current icon: 🌟
🎨 Generating image for: Welcome to Your Journey
📤 Uploading to Supabase: lessons/generated/day-1-welcome-to-your-journey.png
✅ Uploaded successfully
✅ Updated database for lesson abc123
⏳ Waiting 2 seconds before next request...

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ COMPLETE!
✅ Success: 18
❌ Failed: 2
📊 Total: 20
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Troubleshooting

### "Missing OPENROUTER_API_KEY"
Add your API key to `.env.local` as shown above.

### "API error: 429"
You're being rate limited. The script already has 2-second delays, but you may need to increase it.

### "No image in response"
The AI model couldn't generate an image. Check your prompt or try again.

### Images not showing in app
Make sure the `images` bucket in Supabase Storage is **public**:
1. Go to Supabase Dashboard → Storage
2. Click on `images` bucket
3. Make sure it's set to "Public"

## Alternative: Manual Upload

If you prefer to use pre-designed icons instead of AI-generated ones:

1. Place PNG files in `public/lessons&quizzes/`
2. Run the original upload script: `node scripts/upload-images.js`

