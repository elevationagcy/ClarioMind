const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET_NAME = 'meditation-audio'
const MIXED_DIR = 'public/music/mixed'

// Meditation mappings
const MEDITATIONS = [
  {
    file: 'grounding-meditation.mp3',
    lessonTitle: 'Introduction to Mindfulness',
    name: 'Grounding Meditation',
    duration: 5 // minutes (will be calculated from file)
  },
  {
    file: 'breath-awareness-meditation.mp3',
    lessonTitle: 'Anxiety and Alcohol: The Cycle',
    name: 'Breath Awareness',
    duration: 3
  },
  {
    file: 'self-compassion-meditation.mp3',
    lessonTitle: 'Self-Compassion Practice',
    name: 'Self-Compassion',
    duration: 3
  },
  {
    file: 'stress-release-meditation.mp3',
    lessonTitle: 'Emotional Regulation Skills',
    name: 'Stress Release',
    duration: 2
  }
]

async function main() {
  console.log('🎵 Uploading Meditation Audio to Supabase\n')
  console.log('=' .repeat(50))
  
  // Debug: Print available env vars
  console.log('📋 Checking environment variables...')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? '✅ Found' : '❌ Missing'}`)
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY ? '✅ Found' : '❌ Missing'}`)
  console.log('')
  
  // Check alternative variable names
  const ALT_SERVICE_KEY = process.env.SERVICE_ROLE_KEY
  if (ALT_SERVICE_KEY && !SERVICE_ROLE_KEY) {
    console.log('   ℹ️  Found SERVICE_ROLE_KEY instead of SUPABASE_SERVICE_ROLE_KEY')
  }
  
  // Validate environment variables
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  // Create Supabase client with service role
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('✅ Connected to Supabase')
  console.log('')

  // Check if bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`)
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3']
    })
    
    if (error) {
      console.error('❌ Error creating bucket:', error.message)
      process.exit(1)
    }
    console.log('✅ Bucket created\n')
  } else {
    console.log(`✅ Bucket exists: ${BUCKET_NAME}\n`)
  }

  // Upload each meditation file
  const uploadedMeditations = []
  
  for (const meditation of MEDITATIONS) {
    const filePath = path.join(MIXED_DIR, meditation.file)
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      continue
    }

    console.log(`📤 Uploading: ${meditation.file}`)
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath)
    const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2)
    console.log(`   Size: ${fileSize} MB`)
    
    // Upload to Supabase Storage
    const storagePath = `${meditation.file}`
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true // Overwrite if exists
      })
    
    if (error) {
      console.error(`   ❌ Upload error: ${error.message}`)
      continue
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)
    
    console.log(`   ✅ Uploaded successfully`)
    console.log(`   🔗 URL: ${publicUrl}`)
    
    uploadedMeditations.push({
      ...meditation,
      publicUrl
    })
    
    console.log('')
  }

  // Update database with meditation URLs
  console.log('=' .repeat(50))
  console.log('📊 Updating database...\n')
  
  for (const meditation of uploadedMeditations) {
    console.log(`🔄 Updating lesson: "${meditation.lessonTitle}"`)
    
    // Find the lesson by title
    const { data: lessons, error: selectError } = await supabase
      .from('lessons')
      .select('id, title')
      .ilike('title', `%${meditation.lessonTitle}%`)
      .limit(1)
    
    if (selectError) {
      console.error(`   ❌ Error finding lesson: ${selectError.message}`)
      continue
    }
    
    if (!lessons || lessons.length === 0) {
      console.error(`   ❌ Lesson not found: ${meditation.lessonTitle}`)
      continue
    }
    
    const lesson = lessons[0]
    console.log(`   Found lesson ID: ${lesson.id}`)
    
    // Update with meditation URL
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        meditation_audio_url: meditation.publicUrl,
        is_meditation: true,
        duration_minutes: meditation.duration
      })
      .eq('id', lesson.id)
    
    if (updateError) {
      console.error(`   ❌ Update error: ${updateError.message}`)
      continue
    }
    
    console.log(`   ✅ Database updated`)
    console.log('')
  }

  console.log('=' .repeat(50))
  console.log('🎉 All meditations uploaded and linked!')
  console.log('\n📋 Summary:')
  uploadedMeditations.forEach(m => {
    console.log(`   ✅ ${m.name} (${m.duration} min)`)
  })
  console.log('\n🧘 Your meditation feature is now live!')
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

