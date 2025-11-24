require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openRouterApiKey || openRouterApiKey === 'sk-or-v1-placeholder') {
  console.error('❌ Missing OPENROUTER_API_KEY in .env.local');
  console.log('💡 Get your API key from: https://openrouter.ai/keys');
  console.log('💡 Add it to .env.local: OPENROUTER_API_KEY=sk-or-v1-your-key-here');
  process.exit(1);
}

// Setup Supabase (optional, for uploading)
const adminKey = serviceRoleKey || supabaseAnonKey;
const supabase = supabaseUrl && adminKey ? createClient(supabaseUrl, adminKey, {
  auth: {
    persistSession: false,
  },
}) : null;

const outputDir = path.join(__dirname, '../generated-images');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Generate an image using OpenRouter API (Gemini 3 Pro Image Preview)
 */
async function generateImage(prompt) {
  console.log(`\n🎨 Generating image with Gemini 3 Pro...`);
  console.log(`📝 Prompt: "${prompt}"\n`);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reframe.app',
        'X-Title': 'Reframe Custom Image Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    // Extract images from response
    if (result.choices && result.choices[0]?.message?.images) {
      const images = result.choices[0].message.images;
      console.log(`✅ Generated ${images.length} image(s)\n`);
      
      const imageBuffers = [];
      
      images.forEach((image, index) => {
        const imageUrl = image.image_url.url; // Base64 data URL
        console.log(`📥 Processing image ${index + 1}...`);
        
        // Remove data:image/png;base64, prefix if present
        const base64Image = imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        
        imageBuffers.push(buffer);
      });
      
      return imageBuffers;
    } else {
      throw new Error('No images in response');
    }
  } catch (error) {
    console.error(`❌ Failed to generate image:`, error.message);
    return null;
  }
}

/**
 * Save image to local file system
 */
function saveImageLocally(imageBuffer, index = 0) {
  const timestamp = Date.now();
  const fileName = `gemini-3-pro-${timestamp}-${index}.png`;
  const filePath = path.join(outputDir, fileName);

  try {
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`✅ Saved: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Failed to save image:`, error.message);
    return null;
  }
}

/**
 * Upload image to Supabase Storage (optional)
 */
async function uploadToSupabase(imageBuffer, fileName) {
  if (!supabase) {
    console.log('⚠️  Supabase not configured, skipping upload');
    return null;
  }

  const uploadPath = `custom-generations/${fileName}`;

  console.log(`📤 Uploading to Supabase: ${uploadPath}`);

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(uploadPath, imageBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png',
      });

    if (error) {
      throw error;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(uploadPath).data.publicUrl;
    console.log(`✅ Uploaded: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload:`, error.message);
    return null;
  }
}

/**
 * Get prompt from command line or interactive input
 */
async function getPrompt() {
  // Check if prompt was provided as command-line argument
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args.join(' ');
  }

  // Interactive prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n💬 Enter your image generation prompt: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Ask if user wants to upload to Supabase
 */
async function askUploadToSupabase() {
  if (!supabase) return false;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n📤 Upload to Supabase? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Gemini 3 Pro Custom Image Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Get prompt
  const prompt = await getPrompt();
  
  if (!prompt || prompt.trim() === '') {
    console.error('❌ No prompt provided');
    process.exit(1);
  }

  // Generate image
  const imageBuffers = await generateImage(prompt);
  
  if (!imageBuffers || imageBuffers.length === 0) {
    console.error('❌ Failed to generate images');
    process.exit(1);
  }

  console.log('\n💾 Saving images locally...\n');

  // Save all generated images
  const savedPaths = [];
  for (let i = 0; i < imageBuffers.length; i++) {
    const filePath = saveImageLocally(imageBuffers[i], i);
    if (filePath) {
      savedPaths.push(filePath);
    }
  }

  // Ask about Supabase upload
  const shouldUpload = await askUploadToSupabase();
  
  if (shouldUpload) {
    console.log('\n📤 Uploading to Supabase...\n');
    
    for (let i = 0; i < imageBuffers.length; i++) {
      const timestamp = Date.now();
      const fileName = `gemini-3-pro-${timestamp}-${i}.png`;
      await uploadToSupabase(imageBuffers[i], fileName);
    }
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ COMPLETE!');
  console.log(`✅ Generated: ${imageBuffers.length} image(s)`);
  console.log(`📁 Saved to: ${outputDir}`);
  
  if (savedPaths.length > 0) {
    console.log('\n📄 Files:');
    savedPaths.forEach((filePath, i) => {
      console.log(`   ${i + 1}. ${path.basename(filePath)}`);
    });
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

