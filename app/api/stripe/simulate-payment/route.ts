import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint is for TESTING ONLY - simulates a successful payment
// Remove or disable in production!

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Insert a simulated payment record
    const { data, error } = await supabaseAdmin.from('payments').insert({
      email,
      stripe_session_id: `test_session_${Date.now()}`,
      stripe_payment_intent_id: `test_pi_${Date.now()}`,
      amount: 4900, // $49.00
      currency: 'usd',
      status: 'completed',
      quiz_data: {},
      created_at: new Date().toISOString(),
    }).select().single()

    if (error) {
      console.error('Error creating payment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check if user already exists and update their has_paid status
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('email', email)
      .single()

    if (existingProfile) {
      await supabaseAdmin
        .from('user_profiles')
        .update({ has_paid: true })
        .eq('user_id', existingProfile.user_id)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Payment simulated for ${email}`,
      payment: data
    })
  } catch (error) {
    console.error('Simulate payment error:', error)
    return NextResponse.json(
      { error: 'Failed to simulate payment' },
      { status: 500 }
    )
  }
}

