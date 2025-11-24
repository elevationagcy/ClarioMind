require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!openRouterApiKey || openRouterApiKey === 'sk-or-v1-placeholder') {
  console.error('❌ Missing OPENROUTER_API_KEY in .env.local');
  process.exit(1);
}

const adminKey = serviceRoleKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, adminKey, {
  auth: {
    persistSession: false,
  },
});

const bucketName = 'images';
const tempDir = path.join(__dirname, '../temp-images');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Generate an image using OpenRouter API
 */
async function generateImage(item, type) {
  const prompt = type === 'challenge' 
    ? `Create a vibrant, inspiring, modern icon representing "${item.title}" challenge for sobriety and wellness.
Style: Bold colors, energetic, motivational, flat design.
Theme: ${item.category}
The image should convey: empowerment, community, growth, positive change.
No text in the image, just powerful visual symbols.
This is for a ${item.duration_days}-day challenge that ${item.participants_count}+ people have joined.`
    : `Create a warm, professional, trustworthy icon representing a coaching tip: "${item.title}".
Style: Soft colors, approachable, professional, modern flat design.
Coach: ${item.coach_name}
Category: ${item.category}
The image should convey: wisdom, support, guidance, trust.
No text in the image, just symbolic representations.
This is advice from an expert coach helping people with sobriety.`;

  console.log(`🎨 Generating ${type} image: ${item.title}`);

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
            content: [{ type: 'text', text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.images?.[0]?.image_url?.url) {
      const base64Data = data.choices[0].message.images[0].image_url.url;
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');
      return buffer;
    } else {
      throw new Error('No image in response');
    }
  } catch (error) {
    console.error(`❌ Failed to generate ${type} image:`, error.message);
    return null;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(imageBuffer, item, type) {
  const fileName = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  const uploadPath = `${type}s/${fileName}`;

  console.log(`📤 Uploading to Supabase: ${uploadPath}`);

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uploadPath, imageBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png',
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(uploadPath).data.publicUrl;
    console.log(`✅ Uploaded: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload:`, error.message);
    return null;
  }
}

/**
 * Update icon in database
 */
async function updateIcon(id, iconUrl, table) {
  const { error } = await supabase
    .from(table)
    .update({ icon: iconUrl })
    .eq('id', id);

  if (error) {
    console.error(`❌ Failed to update ${table}:`, error.message);
    return false;
  }

  console.log(`✅ Updated ${table} database`);
  return true;
}

/**
 * Process a single item
 */
async function processItem(item, type, table) {
  console.log(`\n━━━ ${type.toUpperCase()}: ${item.title} ━━━`);
  
  try {
    // Generate image
    const imageBuffer = await generateImage(item, type);
    if (!imageBuffer) {
      return { success: false, item };
    }

    // Save temporarily
    const tempPath = path.join(tempDir, `${type}-${item.title.slice(0, 20).replace(/[^a-z0-9]+/g, '-')}.png`);
    fs.writeFileSync(tempPath, imageBuffer);
    console.log(`💾 Saved: ${tempPath}`);

    // Upload to Supabase
    const publicUrl = await uploadImage(imageBuffer, item, type);
    if (!publicUrl) {
      return { success: false, item };
    }

    // Update database
    const updated = await updateIcon(item.id, publicUrl, table);
    if (!updated) {
      return { success: false, item };
    }

    console.log(`✅ COMPLETE: ${item.title}\n`);
    return { success: true, item };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { success: false, item, error };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting AI image generation for challenges and tips...\n');

  // Get all challenges
  const { data: challenges, error: challengesError } = await supabase
    .from('challenges')
    .select('*');

  if (challengesError) {
    console.error('❌ Error fetching challenges:', challengesError.message);
    process.exit(1);
  }

  // Get all tips
  const { data: tips, error: tipsError } = await supabase
    .from('tips')
    .select('*');

  if (tipsError) {
    console.error('❌ Error fetching tips:', tipsError.message);
    process.exit(1);
  }

  console.log(`📊 Found ${challenges.length} challenges and ${tips.length} tips\n`);

  const results = [];

  // Process challenges
  if (challenges.length > 0) {
    console.log('\n🏆 PROCESSING CHALLENGES...\n');
    for (const challenge of challenges) {
      const result = await processItem(challenge, 'challenge', 'challenges');
      results.push({ ...result, type: 'challenge' });
      
      // Wait between requests
      if (challenges.indexOf(challenge) < challenges.length - 1) {
        console.log('⏳ Waiting 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Process tips
  if (tips.length > 0) {
    console.log('\n💡 PROCESSING TIPS FROM COACHES...\n');
    for (const tip of tips) {
      const result = await processItem(tip, 'tip', 'tips');
      results.push({ ...result, type: 'tip' });
      
      // Wait between requests
      if (tips.indexOf(tip) < tips.length - 1) {
        console.log('⏳ Waiting 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Calculate stats
  const challengeResults = results.filter(r => r.type === 'challenge');
  const tipResults = results.filter(r => r.type === 'tip');
  
  const challengeSuccess = challengeResults.filter(r => r.success).length;
  const tipSuccess = tipResults.filter(r => r.success).length;
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ COMPLETE!');
  console.log(`\n🏆 Challenges: ${challengeSuccess}/${challenges.length} success`);
  console.log(`💡 Tips: ${tipSuccess}/${tips.length} success`);
  console.log(`📊 Total: ${challengeSuccess + tipSuccess}/${challenges.length + tips.length} success`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

