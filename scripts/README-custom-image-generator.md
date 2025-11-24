# 🎨 Custom Image Generator with Gemini 3 Pro

Generate custom images using Google's Gemini 3 Pro Image Preview model via OpenRouter API.

## 🚀 Setup

1. **Get API Key:**
   - Visit: https://openrouter.ai/keys
   - Create an account and generate an API key
   - Add to `.env.local`:
     ```
     OPENROUTER_API_KEY=sk-or-v1-your-key-here
     ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

## 📝 Usage

### Method 1: Command Line Argument
```bash
node scripts/generate-custom-image.js "A serene mountain landscape at sunset with vibrant colors"
```

### Method 2: Interactive Prompt
```bash
node scripts/generate-custom-image.js
```
Then enter your prompt when asked.

## 📋 Examples

**Minimalist Icon:**
```bash
node scripts/generate-custom-image.js "A clean, minimalist icon of a brain with geometric patterns, pastel colors, flat design"
```

**Abstract Art:**
```bash
node scripts/generate-custom-image.js "Abstract representation of sobriety and mental clarity, using soft gradients and flowing shapes"
```

**Nature Scene:**
```bash
node scripts/generate-custom-image.js "A peaceful zen garden with cherry blossoms, professional photography style"
```

**UI Element:**
```bash
node scripts/generate-custom-image.js "Modern mobile app icon for meditation, rounded square, gradient background, simple symbol"
```

## 📁 Output

- **Local Storage:** Images are saved to `generated-images/` directory
- **File Format:** PNG
- **Naming:** `gemini-3-pro-[timestamp]-[index].png`
- **Supabase Upload:** Optional upload to `images/custom-generations/` bucket

## ⚡ Features

- ✅ **Gemini 3 Pro Image Generation** - Latest Google AI model
- ✅ **Custom Prompts** - Full control over image generation
- ✅ **Multiple Images** - Generates all images from response
- ✅ **Local Save** - Automatic save to file system
- ✅ **Supabase Integration** - Optional cloud upload
- ✅ **Interactive Mode** - User-friendly prompts
- ✅ **Command Line Mode** - Script automation support

## 🎯 Prompt Tips

### For Best Results:

1. **Be Specific:** 
   - ❌ "A nice image"
   - ✅ "A minimalist icon of a sunrise with warm gradient colors"

2. **Specify Style:**
   - "Flat design", "3D render", "Watercolor painting", "Professional photography"

3. **Include Colors:**
   - "Pastel colors", "Vibrant orange and blue", "Monochromatic purple tones"

4. **Set Context:**
   - "For a mobile app", "Social media post", "Website hero image"

5. **Avoid Text:**
   - AI struggles with text in images
   - Request symbols/icons instead of words

## 🔧 Advanced Usage

### Generate Multiple Images
Run the script multiple times or modify the API call to request multiple variations.

### Custom Output Directory
Edit `outputDir` in the script:
```javascript
const outputDir = path.join(__dirname, '../my-custom-images');
```

### Batch Generation
Create a text file with prompts and automate:
```bash
cat prompts.txt | while read prompt; do
  node scripts/generate-custom-image.js "$prompt"
  sleep 5
done
```

## 💰 API Costs

- **Model:** `google/gemini-3-pro-image-preview`
- **Pricing:** Check OpenRouter pricing page for current rates
- **Monitoring:** View usage at https://openrouter.ai/usage

## 🐛 Troubleshooting

**Error: Missing OPENROUTER_API_KEY**
- Add your API key to `.env.local`

**Error: API error 429**
- Rate limited. Wait a few seconds between requests.

**Error: No images in response**
- Try a different prompt
- Model may have content restrictions

**Images not saving**
- Check file permissions
- Ensure `generated-images/` directory exists

## 📚 Resources

- [OpenRouter Docs](https://openrouter.ai/docs)
- [Gemini API Guide](https://ai.google.dev/gemini-api/docs)
- [Prompt Engineering Tips](https://platform.openai.com/docs/guides/prompt-engineering)

