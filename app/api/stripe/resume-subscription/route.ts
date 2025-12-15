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

    // Resume the subscription by setting cancel_at_period_end to false
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    console.log('[Resume] Subscription resumed:', subscription.id)
    console.log('[Resume] Cancel at period end:', (subscription as any).cancel_at_period_end)

    // Update database
    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      // Update payments table
      await supabaseAdmin
        .from('payments')
        .update({ 
          subscription_status: 'active',
          subscription_ends_at: null, // Clear the end date
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId)

      // Update user_profiles
      await supabaseAdmin
        .from('user_profiles')
        .update({ 
          subscription_status: 'active',
          subscription_ends_at: null,
        })
        .eq('user_id', userId)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Subscription has been resumed',
    })
  } catch (error) {
    console.error('Resume subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to resume subscription' },
      { status: 500 }
    )
  }
}

