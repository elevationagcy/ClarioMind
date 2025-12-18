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
    // Initial checkout completed (subscription started)
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('[Webhook] Processing checkout.session.completed')
      console.log('[Webhook] Session ID:', session.id)
      console.log('[Webhook] Customer email:', session.customer_email)
      console.log('[Webhook] Subscription ID:', session.subscription)
      console.log('[Webhook] Mode:', session.mode)
      
      const email = session.customer_email || session.metadata?.email
      const quizData = session.metadata?.quizData 
        ? JSON.parse(session.metadata.quizData) 
        : {}

      if (!email) {
        console.error('[Webhook] No email found in session')
        break
      }

      // Check if user already exists with this email
      const { data: existingProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('email', email)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[Webhook] Error checking profile:', profileError)
      }

      // Determine if this is a subscription or one-time payment
      const isSubscription = session.mode === 'subscription'
      
      // Get subscription details including billing interval
      let billingIntervalCount = 1 // Default to 1 month
      let currentPeriodEnd: string | null = null
      
      if (isSubscription && session.subscription) {
        try {
          const stripeSubscription = await stripe!.subscriptions.retrieve(session.subscription as string)
          const priceData = stripeSubscription.items.data[0]?.price
          billingIntervalCount = priceData?.recurring?.interval_count || 1
          currentPeriodEnd = stripeSubscription.current_period_end 
            ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
            : null
          console.log('[Webhook] Billing interval count:', billingIntervalCount)
          console.log('[Webhook] Current period end:', currentPeriodEnd)
        } catch (err) {
          console.error('[Webhook] Error fetching subscription details:', err)
        }
      }
      
      // Store payment/subscription record
      const paymentData: Record<string, unknown> = {
        email,
        user_id: existingProfile?.user_id || null,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string || null,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
        quiz_data: quizData,
        created_at: new Date().toISOString(),
        payment_type: isSubscription ? 'subscription' : 'one_time',
      }

      // Add subscription-specific fields
      if (isSubscription) {
        paymentData.stripe_subscription_id = session.subscription as string
        paymentData.subscription_status = 'active' // Will start as trialing if there's a trial
        paymentData.billing_interval_count = billingIntervalCount
        paymentData.next_billing_date = currentPeriodEnd
      } else {
        paymentData.stripe_payment_intent_id = session.payment_intent as string
      }

      const { data: paymentRecord, error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert(paymentData)
        .select()
        .single()

      if (paymentError) {
        console.error('[Webhook] Error storing payment:', paymentError)
      } else {
        console.log('[Webhook] Payment stored successfully:', paymentRecord?.id)
      }

      // Update user profile if exists - also clear any cancellation state
      if (existingProfile) {
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            has_paid: true,
            subscription_status: isSubscription ? 'active' : null,
            subscription_ends_at: null, // Clear cancellation end date
            stripe_customer_id: session.customer as string || null,
          })
          .eq('user_id', existingProfile.user_id)

        if (updateError) {
          console.error('[Webhook] Error updating user payment status:', updateError)
        } else {
          console.log('[Webhook] Updated has_paid for user:', existingProfile.user_id)
        }
      }

      // Also update any existing payment records for this user to mark old ones as superseded
      if (existingProfile && isSubscription) {
        // Update old payment records to clear canceling status if user re-subscribed
        await supabaseAdmin
          .from('payments')
          .update({ 
            subscription_status: 'superseded',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', existingProfile.user_id)
          .eq('subscription_status', 'canceling')
          .neq('stripe_subscription_id', session.subscription as string)
      }
      
      break
    }

    // Subscription status updated (e.g., trial ended, renewed, un-canceled)
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      
      // Check if subscription is set to cancel at period end
      const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end
      const currentPeriodEnd = (subscription as any).current_period_end
      
      // Determine the effective status - if cancel_at_period_end is true, treat as 'canceling'
      const effectiveStatus = cancelAtPeriodEnd && subscription.status === 'active' 
        ? 'canceling' 
        : subscription.status
      
      // Calculate subscription_ends_at only if canceling
      const subscriptionEndsAt = cancelAtPeriodEnd && currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null // Clear the end date if not canceling
      
      console.log('[Webhook] Processing customer.subscription.updated')
      console.log('[Webhook] Subscription ID:', subscription.id)
      console.log('[Webhook] Stripe Status:', subscription.status)
      console.log('[Webhook] Cancel at period end:', cancelAtPeriodEnd)
      console.log('[Webhook] Effective Status:', effectiveStatus)
      console.log('[Webhook] Subscription ends at:', subscriptionEndsAt)

      // Update subscription status in payments table
      const { data: paymentData, error: updatePaymentError } = await supabaseAdmin
        .from('payments')
        .update({ 
          subscription_status: effectiveStatus,
          subscription_ends_at: subscriptionEndsAt, // Clear if not canceling
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
        .select('user_id, email')
        .single()

      if (updatePaymentError) {
        console.error('[Webhook] Error updating payment subscription status:', updatePaymentError)
      }

      // Prepare the profile update data
      const profileUpdate = {
        subscription_status: effectiveStatus,
        subscription_ends_at: subscriptionEndsAt,
        // If subscription is canceled or past_due, mark as not paid
        // But if it's 'canceling', user still has access until period end
        has_paid: ['active', 'trialing', 'canceling'].includes(effectiveStatus),
      }

      // Update user_profiles by stripe_customer_id
      if (subscription.customer) {
        const { error: updateProfileError } = await supabaseAdmin
          .from('user_profiles')
          .update(profileUpdate)
          .eq('stripe_customer_id', subscription.customer as string)

        if (updateProfileError) {
          console.error('[Webhook] Error updating profile by customer_id:', updateProfileError)
        }
      }

      // Also try updating by user_id from payment record (backup for reliability)
      if (paymentData?.user_id) {
        const { error: updateProfileError2 } = await supabaseAdmin
          .from('user_profiles')
          .update(profileUpdate)
          .eq('user_id', paymentData.user_id)

        if (updateProfileError2) {
          console.error('[Webhook] Error updating profile by user_id:', updateProfileError2)
        } else {
          console.log('[Webhook] Successfully updated profile by user_id:', paymentData.user_id)
        }
      }
      
      break
    }

    // Subscription canceled
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      
      console.log('[Webhook] Processing customer.subscription.deleted')
      console.log('[Webhook] Subscription ID:', subscription.id)

      // Update payment record
      const { data: paymentData, error: updatePaymentError } = await supabaseAdmin
        .from('payments')
        .update({ 
          subscription_status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
        .select('user_id, email')
        .single()

      if (updatePaymentError) {
        console.error('[Webhook] Error updating payment to canceled:', updatePaymentError)
      }

      // Update user profile - try both by stripe_customer_id AND user_id for reliability
      if (subscription.customer) {
        const { error: updateProfileError1 } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            subscription_status: 'canceled',
            has_paid: false,
          })
          .eq('stripe_customer_id', subscription.customer as string)

        if (updateProfileError1) {
          console.error('[Webhook] Error updating profile by customer_id:', updateProfileError1)
        }
      }

      // Also try updating by user_id from payment record (backup)
      if (paymentData?.user_id) {
        const { error: updateProfileError2 } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            subscription_status: 'canceled',
            has_paid: false,
          })
          .eq('user_id', paymentData.user_id)

        if (updateProfileError2) {
          console.error('[Webhook] Error updating profile by user_id:', updateProfileError2)
        } else {
          console.log('[Webhook] Successfully updated profile by user_id:', paymentData.user_id)
        }
      }
      
      break
    }

    // Monthly payment succeeded
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      // Get subscription ID - it can be string or Subscription object
      const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string' 
        ? invoice.parent.subscription_details.subscription 
        : (invoice.parent?.subscription_details?.subscription as Stripe.Subscription | null)?.id || null
      
      console.log('[Webhook] Processing invoice.payment_succeeded')
      console.log('[Webhook] Invoice ID:', invoice.id)
      console.log('[Webhook] Subscription:', subscriptionId)
      
      // If this is a subscription invoice (not the first one), update payment info
      if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
        console.log('[Webhook] Recurring payment successful for subscription:', subscriptionId)
        
        // Fetch the subscription to get the next billing date
        let nextBillingDate: string | null = null
        try {
          const stripeSubscription = await stripe!.subscriptions.retrieve(subscriptionId)
          if (stripeSubscription.current_period_end) {
            nextBillingDate = new Date(stripeSubscription.current_period_end * 1000).toISOString()
          }
        } catch (err) {
          console.error('[Webhook] Error fetching subscription for next_billing_date:', err)
        }
        
        // Update the payment record with latest payment info and next billing date
        const { error } = await supabaseAdmin
          .from('payments')
          .update({ 
            last_payment_at: new Date().toISOString(),
            subscription_status: 'active',
            next_billing_date: nextBillingDate,
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('[Webhook] Error updating last payment:', error)
        }
      }
      
      break
    }

    // Monthly payment failed
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // Get subscription ID - it can be string or Subscription object
      const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string' 
        ? invoice.parent.subscription_details.subscription 
        : (invoice.parent?.subscription_details?.subscription as Stripe.Subscription | null)?.id || null
      
      console.log('[Webhook] Processing invoice.payment_failed')
      console.log('[Webhook] Invoice ID:', invoice.id)
      console.log('[Webhook] Subscription:', subscriptionId)

      if (subscriptionId) {
        // Update payment record
        const { error: updatePaymentError } = await supabaseAdmin
          .from('payments')
          .update({ 
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (updatePaymentError) {
          console.error('[Webhook] Error updating payment to past_due:', updatePaymentError)
        }

        // Update user profile
        if (invoice.customer) {
          const { error: updateProfileError } = await supabaseAdmin
            .from('user_profiles')
            .update({ 
              subscription_status: 'past_due',
            })
            .eq('stripe_customer_id', invoice.customer as string)

          if (updateProfileError) {
            console.error('[Webhook] Error updating profile to past_due:', updateProfileError)
          }
        }
      }
      
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[Webhook] Checkout session expired:', session.id)
      break
    }

    default:
      console.log('[Webhook] Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
