import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Supabase client with service role for webhook handling
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Try both possible env var names
  const key = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log('[Webhook] Supabase URL:', url ? 'SET' : 'MISSING')
  console.log('[Webhook] Service Role Key:', key ? 'SET' : 'MISSING')
  
  if (!url || !key) {
    console.error('[Webhook] Missing Supabase credentials')
    return null
  }
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  console.log('[Webhook] Received request')
  
  if (!stripe) {
    console.error('[Webhook] Stripe not configured')
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  console.log('[Webhook] Signature present:', !!signature)

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('[Webhook] Event verified:', event.type)
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  const supabaseAdmin = getSupabaseAdmin()
  
  if (!supabaseAdmin) {
    console.error('[Webhook] Supabase admin client not available')
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('[Webhook] Processing checkout.session.completed')
      console.log('[Webhook] Session ID:', session.id)
      console.log('[Webhook] Customer email:', session.customer_email)
      console.log('[Webhook] Metadata:', session.metadata)
      
      // Get email from session (Stripe uses customer_email or we pass it in metadata)
      const email = session.customer_email || session.metadata?.email
      const quizData = session.metadata?.quizData 
        ? JSON.parse(session.metadata.quizData) 
        : {}

      if (!email) {
        console.error('[Webhook] No email found in session')
        break
      }

      console.log('[Webhook] Processing payment for email:', email)

      // Check if user already exists with this email
      const { data: existingProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('email', email)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[Webhook] Error checking profile:', profileError)
      }

      // Store payment record
      const { data: paymentRecord, error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          email,
          user_id: existingProfile?.user_id || null,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: session.customer as string || null,
          amount: session.amount_total,
          currency: session.currency,
          status: 'completed',
          quiz_data: quizData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (paymentError) {
        console.error('[Webhook] Error storing payment:', paymentError)
      } else {
        console.log('[Webhook] Payment stored successfully:', paymentRecord?.id)
      }

      // If user already exists, update their payment status
      if (existingProfile) {
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ has_paid: true })
          .eq('user_id', existingProfile.user_id)

        if (updateError) {
          console.error('[Webhook] Error updating user payment status:', updateError)
        } else {
          console.log('[Webhook] Updated has_paid for user:', existingProfile.user_id)
        }
      } else {
        console.log('[Webhook] No existing user for email:', email, '- Payment stored, will link on registration')
      }
      
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[Webhook] Checkout session expired:', session.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('[Webhook] Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log('[Webhook] Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
