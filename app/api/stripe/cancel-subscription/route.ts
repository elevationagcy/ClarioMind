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

    const { subscriptionId, userId } = await request.json()

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Subscription ID and User ID are required' },
        { status: 400 }
      )
    }

    // Cancel the subscription at period end (user keeps access until end of billing period)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Safely extract dates from subscription response
    const cancelAt = (subscription as any).cancel_at
    const currentPeriodEnd = (subscription as any).current_period_end
    const subscriptionEndsAt = currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null

    // Update database
    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      // Update payments table
      await supabaseAdmin
        .from('payments')
        .update({ 
          subscription_status: 'canceling',
          subscription_ends_at: subscriptionEndsAt,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId)

      // Update user_profiles
      await supabaseAdmin
        .from('user_profiles')
        .update({ 
          subscription_status: 'canceling',
          subscription_ends_at: subscriptionEndsAt,
        })
        .eq('user_id', userId)
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: cancelAt ? new Date(cancelAt * 1000).toISOString() : null,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

