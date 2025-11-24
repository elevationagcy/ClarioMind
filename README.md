# Reframe - Sobriety App

The world's most comprehensive alcohol reduction platform built with Next.js 15, TypeScript, and Supabase.

## Features

- ✨ Neuroscience-based behavior change program
- 📝 Personalized onboarding flow (demographics, goals, drinking patterns)
- 📚 Daily lessons and exercises with progress tracking
- 🔥 Streak tracking and gamification
- 🧘 Mindfulness tools and meditations
- 📊 Personal insights and savings calculations
- 👥 Community support (coming soon)

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Mobile-first)
- **Database & Auth:** Supabase with Row Level Security
- **State Management:** React Hooks
- **Form Handling:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - All migrations have been applied via MCP
   - Environment variables are already configured in `.env.local`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Flow

1. **Welcome Screen** → Landing page with gradient background
2. **Auth** → Register or Login with Supabase Auth
3. **Intro Flow** → 5-step introduction to Reframe
4. **Onboarding:**
   - Demographics (sex, age, relationship, environment)
   - Goals (quit/cut back intentions, reasons)
   - Drinking Patterns (drinks per week, spending, triggers)
   - Summary (personalized savings & health improvements)
   - Plan Overview
5. **Tutorial** → 3-step app walkthrough
6. **Dashboard** → Main app with:
   - Daily tasks and lessons
   - Streak tracking
   - 5-tab navigation (Daily Task, Toolkit, Community, Discover, Me)

## Project Structure

```
/app
  /welcome          - Landing page
  /auth             - Login & registration
  /onboarding       - Multi-step onboarding flow
    /intro          - Pre-onboarding intro
    /demographics   - User demographics
    /goals          - Goal setting
    /patterns       - Drinking patterns
    /summary        - Savings calculations
    /plan           - Personalized plan
  /tutorial         - Post-onboarding tutorial
  /dashboard        - Main authenticated app
    /lesson/[id]    - Individual lesson view
    /toolkit        - Tools and resources
    /discover       - Courses and challenges
    /community      - Community features
    /profile        - User profile

/components
  /ui               - Reusable components (Button, Input, Card, etc.)
  /layout           - Bottom navigation

/lib
  /supabase         - Client, server, and middleware config
  /utils            - Helper functions (calculations, cn)
  /constants        - App constants (onboarding options)

/types              - TypeScript type definitions
```

## Database Schema

- **user_profiles** - User demographic information
- **user_goals** - User sobriety goals and intentions
- **drinking_patterns** - Drinking habits and triggers
- **lessons** - Content library
- **user_progress** - Progress tracking and streaks
- **quizzes** - Quiz questions (future feature)

All tables have Row Level Security (RLS) enabled.

## Key Features Implemented

### Authentication
- Supabase Auth with email/password
- Protected routes via middleware
- Session management

### Onboarding
- Multi-step forms with validation
- Data persistence to Supabase
- Personalized calculations (savings, calories, REM cycles)

### Dashboard
- Daily lesson system with locking mechanism
- Streak tracking visualization
- Progress indicators
- Bottom navigation with 5 tabs

### Mobile-First Design
- Responsive layouts optimized for mobile
- Touch-friendly UI elements (min 44px tap targets)
- Safe area insets for iOS
- Smooth animations and transitions

## Environment Variables

The following environment variables are configured:

```
NEXT_PUBLIC_SUPABASE_URL=https://rqdzccfjkppxbcorwwuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Sample Data

The database includes 6 sample lessons:
1. Alcohol, Dopamine, and the Hedonic Set Point (3 min reading)
2. Urge Surfing Exercise (2 min exercise)
3. Log Your Stress (1 min reflection)
4. Understanding Alcohol's Impact on Sleep (4 min reading)
5. Mindful Breathing Meditation (5 min exercise)
6. The Power of Self-Compassion (4 min reading)

## Development

To add new features:

1. **New lessons:** Insert into `lessons` table via Supabase
2. **New pages:** Add to `/app` directory following Next.js App Router conventions
3. **New components:** Add to `/components` with proper TypeScript types
4. **Database changes:** Use Supabase migrations via MCP

## License

Private - All rights reserved

