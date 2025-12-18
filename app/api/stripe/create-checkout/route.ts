import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const { email, quizData, planId, priceId: clientPriceId } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Map plan IDs to their price IDs (server-side validation)
    const priceMapping: Record<string, string | undefined> = {
      '1-month': process.env.STRIPE_PRICE_1_MONTH,
      '3-month': process.env.STRIPE_PRICE_3_MONTH,
      '6-month': process.env.STRIPE_PRICE_6_MONTH,
    }

    // Use server-side price ID for security, fallback to default
    const priceId = planId ? priceMapping[planId] : process.env.STRIPE_PRICE_ID
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected or price not configured' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Use 'subscription' mode for recurring payments
      mode: 'subscription',
      subscription_data: {
        metadata: {
          email,
          planId: planId || 'default',
          quizData: JSON.stringify(quizData || {}),
        },
      },
      success_url: `${request.headers.get('origin')}/quiz/upsell?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/quiz/checkout?canceled=true`,
      metadata: {
        email,
        planId: planId || 'default',
        quizData: JSON.stringify(quizData || {}),
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
