require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY; // You'll need to add this

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗');
  process.exit(1);
}

if (!openRouterApiKey || openRouterApiKey === 'sk-or-v1-placeholder') {
  console.error('❌ Missing OPENROUTER_API_KEY in .env.local');
  console.log('💡 Get your API key from: https://openrouter.ai/keys');
  console.log('💡 Add it to .env.local: OPENROUTER_API_KEY=sk-or-v1-your-key-here');
  process.exit(1);
}

// Use service role key for admin operations (storage upload, db updates)
// Fall back to anon key if service role not available
const adminKey = serviceRoleKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, adminKey, {
  auth: {
    persistSession: false,
  },
});

const bucketName = 'images';
const storagePathPrefix = 'lessons/generated/';
const tempDir = path.join(__dirname, '../temp-images');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Generate an image using OpenRouter API (Gemini 2.5 Flash Image Preview)
 */
async function generateImage(lesson) {
  const prompt = `Create a clean, modern, minimalist icon representing "${lesson.title}". 
Style: Flat design, simple shapes, pastel colors, professional.
Category: ${lesson.category}
Context: ${lesson.content.substring(0, 200)}...
The image should be suitable for a mobile app about sobriety and mental health.
No text in the image, just visual symbols.`;

  console.log(`🎨 Generating image for: ${lesson.title}`);
  console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reframe.app',
        'X-Title': 'Reframe Sobriety App',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    // Extract base64 image from response
    if (data.choices && data.choices[0]?.message?.images?.[0]?.image_url?.url) {
      const base64Data = data.choices[0].message.images[0].image_url.url;
      
      // Remove data:image/png;base64, prefix if present
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');
      
      return buffer;
    } else {
      throw new Error('No image in response');
    }
  } catch (error) {
    console.error(`❌ Failed to generate image for "${lesson.title}":`, error.message);
    return null;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImageToSupabase(imageBuffer, lesson) {
  const fileName = `day-${lesson.order}-${lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  const uploadPath = `${storagePathPrefix}${fileName}`;

  console.log(`📤 Uploading to Supabase: ${uploadPath}`);

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uploadPath, imageBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png',
      });

    if (error) {
      throw error;
    }

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(uploadPath).data.publicUrl;
    console.log(`✅ Uploaded successfully: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload image:`, error.message);
    return null;
  }
}

/**
 * Update lesson icon in database
 */
async function updateLessonIcon(lessonId, iconUrl) {
  const { error } = await supabase
    .from('lessons')
    .update({ icon: iconUrl })
    .eq('id', lessonId);

  if (error) {
    console.error(`❌ Failed to update lesson ${lessonId}:`, error.message);
    return false;
  }

  console.log(`✅ Updated database for lesson ${lessonId}`);
  return true;
}

/**
 * Process a single lesson
 */
async function processLesson(lesson) {
  console.log(`\n━━━ Day ${lesson.order}: ${lesson.title} ━━━`);
  console.log(`Current icon: ${lesson.icon || '(none)'}`);

  try {
    // Generate image
    const imageBuffer = await generateImage(lesson);
    if (!imageBuffer) {
      console.log(`❌ Failed to generate image\n`);
      return { success: false, lesson };
    }

    // Save temporarily (optional, for debugging)
    const tempPath = path.join(tempDir, `day-${lesson.order}.png`);
    fs.writeFileSync(tempPath, imageBuffer);
    console.log(`💾 Saved temporarily: ${tempPath}`);

    // Upload to Supabase
    const publicUrl = await uploadImageToSupabase(imageBuffer, lesson);
    if (!publicUrl) {
      console.log(`❌ Failed to upload\n`);
      return { success: false, lesson };
    }

    // Update database
    const updated = await updateLessonIcon(lesson.id, publicUrl);
    if (!updated) {
      console.log(`❌ Failed to update database\n`);
      return { success: false, lesson };
    }

    console.log(`✅ COMPLETE: Day ${lesson.order}\n`);
    return { success: true, lesson };
  } catch (error) {
    console.error(`❌ Error processing lesson:`, error.message);
    return { success: false, lesson, error };
  }
}

/**
 * Main function with async batch processing
 */
async function main() {
  console.log('🚀 Starting AI image generation for lessons...\n');

  // Get all lessons that need images (those with emoji icons or no icons)
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order');

  if (error) {
    console.error('❌ Error fetching lessons:', error.message);
    process.exit(1);
  }

  console.log(`📚 Found ${lessons.length} lessons\n`);

  // Filter lessons that need images (emoji or no icon)
  const lessonsNeedingImages = lessons.filter(lesson => {
    const hasNoIcon = !lesson.icon;
    const hasEmoji = lesson.icon && !lesson.icon.startsWith('http'); // Anything not a URL is emoji
    const hasLocalPath = lesson.icon && lesson.icon.startsWith('/lessons&quizzes');
    return hasNoIcon || (hasEmoji && !lesson.icon.startsWith('/')) || hasLocalPath;
  });

  console.log(`🎯 ${lessonsNeedingImages.length} lessons need AI-generated images\n`);
  
  if (lessonsNeedingImages.length === 0) {
    console.log('✨ All lessons already have images!');
    return;
  }

  // Process in batches of 3 to avoid overwhelming the API
  const BATCH_SIZE = 3;
  const results = [];

  for (let i = 0; i < lessonsNeedingImages.length; i += BATCH_SIZE) {
    const batch = lessonsNeedingImages.slice(i, i + BATCH_SIZE);
    console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(lessonsNeedingImages.length / BATCH_SIZE)}`);
    console.log(`   Lessons: ${batch.map(l => `Day ${l.order}`).join(', ')}\n`);

    // Process batch in parallel
    const batchResults = await Promise.all(batch.map(lesson => processLesson(lesson)));
    results.push(...batchResults);

    // Wait between batches to avoid rate limiting
    if (i + BATCH_SIZE < lessonsNeedingImages.length) {
      console.log('\n⏳ Waiting 3 seconds before next batch...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Calculate stats
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ COMPLETE!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${lessonsNeedingImages.length}`);
  
  if (failCount > 0) {
    console.log('\n❌ Failed lessons:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - Day ${r.lesson.order}: ${r.lesson.title}`);
    });
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Clean up temp directory (optional)
  // fs.rmSync(tempDir, { recursive: true, force: true });
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

