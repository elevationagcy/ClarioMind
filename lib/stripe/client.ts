import Stripe from 'stripe'

// Initialize Stripe client - will be null if key is not set (e.g., during build)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  : null

// Publishable key for client-side
export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
    return ''
  }
  return key
}

