# ClarioMind - Transform Your Drinking Habits

Science-backed alcohol reduction app for professionals. Built with Next.js 15, TypeScript, and Supabase.

## Features

- ✨ Neuroscience-based behavior change program
- 📝 Quiz-first onboarding with dependency assessment
- 💳 Stripe payment integration (one-time purchase)
- 📅 Calendly consultation upsell
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
- **Payments:** Stripe
- **State Management:** React Hooks
- **Animations:** Lottie, Framer Motion
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   STRIPE_SECRET_KEY=sk_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...
   
   NEXT_PUBLIC_CALENDLY_URL=your-calendly-link
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Flow

### New User Flow (Quiz-First)
1. **Landing Page** → Beautiful marketing page with ClarioMind content
2. **Quiz** → 12-question dependency assessment (no signup required)
3. **Results** → Show dependency score + collect email
4. **Checkout** → Stripe payment (one-time $49)
5. **Upsell** → Free consultation offer with Calendly booking
6. **Register** → Create account
7. **Onboarding** → Demographics, goals, patterns
8. **Dashboard** → Main app

### Existing User Flow
1. **Login** → Authenticate
2. **Dashboard** → Access app features

## Project Structure

```
/app
  /welcome          - Landing page
  /quiz             - Quiz-first flow
    /results        - Quiz results + email collection
    /checkout       - Stripe payment
    /upsell         - Consultation upsell
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
  /api
    /stripe         - Stripe checkout and webhooks

/components
  /ui               - Reusable components (Button, Input, Card, etc.)
  /layout           - Bottom navigation
  /onboarding       - Onboarding progress component

/lib
  /supabase         - Client, server, and middleware config
  /stripe           - Stripe client config
  /utils            - Helper functions (calculations, quiz-scoring, cn)
  /constants        - App constants (onboarding options)

/types              - TypeScript type definitions
```

## Database Schema

- **user_profiles** - User demographic information
- **user_goals** - User sobriety goals and intentions
- **drinking_patterns** - Drinking habits and triggers
- **quiz_responses** - Quiz answers and scores
- **payments** - Stripe payment records
- **lessons** - Content library
- **user_progress** - Progress tracking and streaks

All tables have Row Level Security (RLS) enabled.

## Key Features Implemented

### Quiz Flow
- 12-question dependency assessment
- Scoring algorithm with 4 risk levels
- Email collection before paywall

### Stripe Integration
- One-time payment checkout
- Webhook handling for payment confirmation
- User provisioning after purchase

### Upsell System
- Free consultation offer
- Calendly integration for booking

### Authentication
- Supabase Auth with email/password
- Protected routes via middleware
- Session management

### Onboarding
- Multi-step forms with validation
- Global progress tracking
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

## Stripe Setup

1. Create a product in Stripe Dashboard
2. Create a price for one-time payment
3. Set up webhook endpoint: `/api/stripe/webhook`
4. Add environment variables

## Calendly Setup

1. Create a ClarioMind team account
2. Set up consultation event type
3. Add the booking URL to environment variables

## Development

To add new features:

1. **New lessons:** Insert into `lessons` table via Supabase
2. **New pages:** Add to `/app` directory following Next.js App Router conventions
3. **New components:** Add to `/components` with proper TypeScript types
4. **Database changes:** Use Supabase migrations via MCP

## License

Private - All rights reserved
