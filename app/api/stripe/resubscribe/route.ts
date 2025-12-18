import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    return null
  }
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const { userId, email, customerId } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Get the price ID from environment variable
    const priceId = process.env.STRIPE_PRICE_ID
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price not configured' },
        { status: 500 }
      )
    }

    // Create checkout session config
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/dashboard?resubscribed=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard/settings?canceled=true`,
      metadata: {
        email,
        userId,
        isResubscribe: 'true',
      },
      subscription_data: {
        metadata: {
          email,
          userId,
        },
      },
      allow_promotion_codes: true,
    }

    // If we have an existing customer ID, use it (preserves payment history)
    if (customerId) {
      sessionConfig.customer = customerId
    } else {
      sessionConfig.customer_email = email
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Resubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}



