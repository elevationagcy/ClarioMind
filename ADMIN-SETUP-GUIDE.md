# 🛡️ Admin System Setup Guide

## Overview

Your app now has a complete admin system for managing content!

---

## ✅ What's Been Created

### 1. **Database Schema**
- ✅ Added `role` column to `user_profiles` (user/admin)
- ✅ Created index for fast role lookups
- ✅ Default role: `user`

### 2. **Admin Dashboard** (`/admin`)
- Main dashboard with quick stats
- 6 admin sections:
  - Lessons
  - Challenges
  - Quizzes
  - Meditations
  - Users
  - Analytics

### 3. **Content Creation Forms**
- ✅ `/admin/lessons/new` - Create lessons with thumbnails
- ✅ `/admin/challenges/new` - Create challenges with images
- ✅ `/admin/meditations/new` - Upload meditation audio
- ⚠️ `/admin/quizzes/new` - (To be created if needed)

### 4. **File Upload**
- ✅ Thumbnail/icon upload for lessons & challenges
- ✅ Audio file upload for meditations
- ✅ Files saved to Supabase Storage
- ✅ Public URLs generated automatically

### 5. **Navigation**
- ✅ Admin tab appears in bottom nav (only for admins)
- ✅ Shield icon to indicate admin access

---

## 🚀 Quick Start

### Step 1: Make Your Account Admin

Run this SQL in Supabase SQL Editor:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'your-email@example.com'  -- Replace with your email
  LIMIT 1
);
```

Or use the provided script:
```bash
# Edit scripts/make-user-admin.sql with your email first
# Then run it in Supabase dashboard
```

### Step 2: Verify Admin Access

1. Refresh your app
2. You should see a **5th tab** (Admin) in the bottom navigation
3. Click it to access the admin dashboard

---

## 📝 How to Create Content

### **Create a Lesson**

1. Go to **Admin** → **Lessons** → **Create**
2. Fill in the form:
   - **Title** (required)
   - **Description** (optional)
   - **Content** (Markdown supported)
   - **Duration** (minutes)
   - **Category** (Neuroscience, Mental Health, etc.)
   - **Day Number** (order in sequence)
   - **Icon** (upload image or use emoji/URL)
3. Click **Create Lesson**

### **Create a Challenge**

1. Go to **Admin** → **Challenges** → **Create**
2. Fill in:
   - **Title** (required)
   - **Description**
   - **Content** (Markdown)
   - **Duration** (e.g., "7 days")
   - **Participants** (number)
   - **Category**
   - **Icon** (upload or emoji)
3. Click **Create Challenge**

### **Upload Meditation Audio**

1. Go to **Admin** → **Meditations** → **Create**
2. Requirements:
   - **Lesson ID** - Must exist first (UUID from database)
   - **Title**
   - **Duration** (minutes)
   - **Audio File** (MP3 recommended)
3. Click **Upload Meditation**
4. The audio will be:
   - Uploaded to Supabase Storage (`meditation-audio` bucket)
   - Linked to the specified lesson
   - Made playable in the meditation player

---

## 🗂️ File Structure

```
app/
├── admin/
│   ├── page.tsx                    # Main dashboard
│   ├── lessons/
│   │   └── new/page.tsx           # Create lesson form
│   ├── challenges/
│   │   └── new/page.tsx           # Create challenge form
│   ├── meditations/
│   │   └── new/page.tsx           # Upload meditation form
│   └── (users, analytics TBD)

lib/
└── auth/
    └── check-admin.ts             # Admin permission checks

scripts/
└── make-user-admin.sql            # SQL to grant admin role
```

---

## 🔒 Security Features

### Role-Based Access
- Only users with `role = 'admin'` can access `/admin/*`
- Admin check happens on page load
- Non-admins redirected to `/dashboard`

### Authentication
- Uses Supabase Auth (existing system)
- Admin status stored in `user_profiles.role`
- Fast lookups with database index

---

## 📤 File Upload Details

### Supported Files

**Images (Thumbnails/Icons):**
- Formats: JPG, PNG, GIF, WebP
- Saved to: `images/lessons/` or `images/challenges/`
- Size: Recommend < 5 MB

**Audio (Meditations):**
- Format: MP3 (recommended), WAV, OGG
- Saved to: `meditation-audio/`
- Size: < 50 MB

### Upload Flow

1. User selects file
2. File previewed locally
3. On submit:
   - File uploaded to Supabase Storage
   - Public URL generated
   - URL saved to database
4. Content immediately available in app

---

## 🎨 Admin Dashboard Features

### Quick Stats
- Total lessons count
- Total challenges count
- Total quizzes count
- Total meditations count

### Action Cards
Each section has:
- Icon with gradient background
- Description
- "Manage" button
- Click → Navigate to creation form

---

## 🛠️ Customization

### Add More Admin Features

**Create Users Management:**
```tsx
// app/admin/users/page.tsx
// List all users, change roles, etc.
```

**Add Analytics:**
```tsx
// app/admin/analytics/page.tsx
// Show usage stats, completion rates, etc.
```

**Create Quiz Form:**
```tsx
// app/admin/quizzes/new/page.tsx
// Similar to lesson form
```

### Modify Navigation

Edit `components/layout/bottom-nav.tsx`:
```tsx
// Change admin nav item position, icon, etc.
const adminNavItem = {
  name: 'Admin',
  href: '/admin',
  icon: Shield,  // Change icon
  activePattern: /^\/admin/,
}
```

---

## 🧪 Testing Checklist

### After Setup:

- [ ] Run admin SQL to grant yourself admin role
- [ ] Refresh app and see Admin tab appear
- [ ] Click Admin tab → See dashboard
- [ ] Create a test lesson with thumbnail
- [ ] Create a test challenge with image
- [ ] Upload test meditation audio
- [ ] Verify files appear in Supabase Storage
- [ ] Verify content appears in main app
- [ ] Test as non-admin user (no Admin tab)

---

## 📊 Database Queries

### Check Admin Users
```sql
SELECT 
  u.email,
  u.created_at,
  p.role
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.role = 'admin';
```

### Make User Admin
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

### Revoke Admin
```sql
UPDATE user_profiles 
SET role = 'user' 
WHERE id = 'user-uuid-here';
```

### Count Content
```sql
SELECT 
  (SELECT COUNT(*) FROM lessons) as lessons,
  (SELECT COUNT(*) FROM challenges) as challenges,
  (SELECT COUNT(*) FROM quizzes) as quizzes,
  (SELECT COUNT(*) FROM lessons WHERE is_meditation = true) as meditations;
```

---

## 🚨 Troubleshooting

### "Admin tab not showing"
- Check your role: `SELECT role FROM user_profiles WHERE id = 'your-user-id'`
- Should be `admin`, not `user`
- Refresh browser (hard refresh: Cmd+Shift+R)

### "Redirected from /admin"
- You don't have admin role
- Run the admin SQL script with your email

### "File upload failed"
- Check Supabase Storage buckets exist:
  - `images` (for thumbnails)
  - `meditation-audio` (for audio files)
- Ensure buckets are **public**
- Check file size limits

### "Lesson ID not found" (meditation upload)
- Create the lesson first
- Copy the UUID from database
- Paste into meditation form

---

## 🎯 Next Steps

1. ✅ Grant yourself admin access
2. ✅ Test creating a lesson
3. ✅ Test uploading a meditation
4. ⚠️ Create quiz form (if needed)
5. ⚠️ Add user management page
6. ⚠️ Add analytics page

---

## 💡 Pro Tips

### Markdown in Content
Use Markdown for rich formatting:

```markdown
# Main Heading
## Subheading

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Item two

[Link text](https://url.com)
```

### Emojis as Icons
Quick option instead of uploading:
- Lessons: 📚 📖 🧠 💡 ✨
- Challenges: 🏆 🎯 💪 🌟 🔥
- Meditations: 🧘 🌙 ☮️ 🕉️ 🌸

### Audio File Tips
- Use MP3 (best compatibility)
- 128-320 kbps quality
- Mono or stereo
- Normalize audio levels
- Add 3s fade in/out

---

**Your admin system is ready! 🎉**

Create amazing content for your users! 🚀

