'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  Loader2, 
  Clock,
  Users,
  LineChart,
  Sparkles,
  Lock,
  Zap,
  Calendar,
  Check
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

interface Plan {
  id: string
  name: string
  duration: string
  pricePerDay: string
  totalPrice: string
  billingPeriod: string
  badge?: string
  savings?: string
  recommended?: boolean
  priceId: string
}

const plans: Plan[] = [
  {
    id: '3-month',
    name: '3-month plan',
    duration: 'every 3 months',
    pricePerDay: '0.67',
    totalPrice: '59.99',
    billingPeriod: 'USD 59.99',
    savings: '33%',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_3_MONTH || '',
  },
  {
    id: '1-month',
    name: '1-month plan',
    duration: 'every month',
    pricePerDay: '1.00',
    totalPrice: '29.99',
    billingPeriod: 'USD 29.99',
    badge: 'Top Choice for Beginners',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_1_MONTH || '',
  },
  {
    id: '6-month',
    name: '6-month plan',
    duration: 'every 6 months',
    pricePerDay: '0.50',
    totalPrice: '89.99',
    billingPeriod: 'USD 89.99',
    savings: '50%',
    recommended: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_6_MONTH || '',
  },
]

function CheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('6-month')

  useEffect(() => {
    const storedEmail = localStorage.getItem('quizEmail')
    if (!storedEmail) {
      router.push('/quiz')
      return
    }
    setEmail(storedEmail)

    if (searchParams.get('canceled') === 'true') {
      setError('Checkout was canceled. You can try again when ready.')
    }
  }, [router, searchParams])

  const handleCheckout = async () => {
    if (!email) return

    const plan = plans.find(p => p.id === selectedPlan)
    if (!plan) return

    setLoading(true)
    setError('')

    try {
      const quizAnswers = localStorage.getItem('quizAnswers')
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          quizData: quizAnswers ? JSON.parse(quizAnswers) : {},
          planId: plan.id,
          priceId: plan.priceId,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to start checkout')
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Clock,
      title: 'Daily 5-minute Lessons',
      description: 'Neuroscience-based insights'
    },
    {
      icon: Users,
      title: '24/7 Anonymous Community',
      description: 'Thousands on the same path'
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description: 'Real-time transformation data'
    },
    {
      icon: Sparkles,
      title: 'Personalized Plan',
      description: 'Tailored to your triggers'
    },
    {
      icon: Calendar,
      title: 'Weekly Check-ins',
      description: 'Structured accountability'
    }
  ]

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const currentPlan = plans.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/quiz/results')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <div className="w-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Choose Your Plan</h1>
          <p className="text-slate-500">Start your transformation journey today</p>
        </div>

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 bg-white overflow-visible ${
                selectedPlan === plan.id
                  ? 'border-blue-500 shadow-lg shadow-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`p-5 ${plan.badge ? 'pt-6' : ''}`}>
                {/* Radio Button */}
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {/* Plan Name */}
                    <h3 className="font-semibold text-slate-800 text-lg">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.duration}</p>
                    <p className="text-slate-500 text-sm mt-1">{plan.billingPeriod}</p>
                  </div>

                  {/* Per Day Price */}
                  <div className="text-right">
                    {plan.savings && (
                      <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-1">
                        Save {plan.savings}
                      </div>
                    )}
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-sm text-slate-500">USD</span>
                      <span className={`text-2xl sm:text-3xl font-bold ${
                        selectedPlan === plan.id ? 'text-blue-600' : 'text-red-500'
                      }`}>
                        {plan.pricePerDay}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">per day</p>
                  </div>
                </div>

                {/* Recommended Badge */}
                {plan.recommended && selectedPlan === plan.id && (
                  <div className="mt-4 flex justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-amber-700">Recommended for your profile</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features & Checkout Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            {/* Selected Plan Summary */}
            <div className="text-center mb-6 pb-6 border-b border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Your selected plan</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-slate-800">${currentPlan?.totalPrice}</span>
                <span className="text-slate-500">/{currentPlan?.duration.replace('every ', '')}</span>
              </div>
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                Only ${currentPlan?.pricePerDay}/day
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">30-Day Money Back Guarantee</h4>
                  <p className="text-sm text-green-600">Not satisfied? Full refund, no questions asked.</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-6 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  Get Started Now
                  <CheckCircle2 className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-4">
            Trusted by thousands of professionals worldwide
          </p>
          <div className="flex items-center justify-center gap-6">
            {[
              { value: '98%', label: 'See improvement' },
              { value: '10k+', label: 'Active users' },
              { value: '4.9★', label: 'User rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}
