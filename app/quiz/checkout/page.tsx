'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  Calendar,
  Check,
  Zap,
  TrendingUp,
  Heart
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

// Track Meta Pixel events
const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, params);
  }
};

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
    id: '1-month',
    name: '1-month plan',
    duration: 'every month',
    pricePerDay: '0.67',
    totalPrice: '19.99',
    billingPeriod: 'USD 19.99',
    badge: 'Top Choice for Beginners',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_1_MONTH || '',
  },
  {
    id: '3-month',
    name: '3-month plan',
    duration: 'every 3 months',
    pricePerDay: '0.60',
    totalPrice: '53.99',
    billingPeriod: 'USD 53.99',
    savings: '10%',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_3_MONTH || '',
  },
  {
    id: '6-month',
    name: '6-month plan',
    duration: 'every 6 months',
    pricePerDay: '0.53',
    totalPrice: '95.99',
    billingPeriod: 'USD 95.99',
    savings: '20%',
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
  const hasTrackedInitiate = useRef(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('quizEmail')
    if (!storedEmail) {
      router.push('/quiz')
      return
    }
    setEmail(storedEmail)

    // Track Checkout Initiated on page load (only once)
    if (!hasTrackedInitiate.current) {
      hasTrackedInitiate.current = true;
      const defaultPlan = plans.find(p => p.id === '6-month');
      trackEvent('InitiateCheckout', {
        content_name: 'ClarioMind Subscription',
        content_ids: ['6-month'],
        value: defaultPlan ? parseFloat(defaultPlan.totalPrice) : 95.99,
        currency: 'USD'
      });
      trackCustomEvent('CheckoutInitiated', {
        plan_id: '6-month'
      });
    }

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const currentPlan = plans.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/quiz/results')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Back to results</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm font-semibold">
            <Shield className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12 sm:py-20 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-blue-100">
            <Sparkles className="w-4 h-4" />
            Your Personalized Path is Ready
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            An Investment in <span className="text-blue-600">Your Future</span>
          </h1>
          <p className="text-slate-500 text-lg sm:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            Join 52,000+ high-performing professionals who have reclaimed their mental clarity and physical vitality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Plan Selection Cards - Left Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
              Select a Subscription Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 bg-white flex flex-col h-full ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-[6px] ring-blue-50/50 z-10 scale-[1.02]'
                      : 'border-slate-100 hover:border-blue-200 hover:shadow-xl translate-y-1 hover:-translate-y-1'
                  }`}
                >
                  {/* Badge */}
                  {(plan.badge || plan.recommended) && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-2">
                      <div className={`${
                        plan.recommended ? 'bg-amber-500 shadow-amber-200' : 'bg-blue-600 shadow-blue-200'
                      } text-white text-[10px] sm:text-xs font-black px-5 py-2 rounded-full shadow-xl whitespace-nowrap uppercase tracking-widest flex items-center gap-2`}>
                        {plan.recommended && <Sparkles className="w-3.5 h-3.5 fill-current" />}
                        {plan.badge || 'Most Popular'}
                      </div>
                    </div>
                  )}

                  <div className={`p-4 sm:p-6 flex flex-col flex-1 ${plan.badge || plan.recommended ? 'pt-9 sm:pt-12' : 'pt-7 sm:pt-10'}`}>
                    {/* Header Info */}
                    <div className="text-center mb-2 sm:mb-4">
                      <h3 className="font-black text-slate-900 text-xl mb-2 tracking-tight">{plan.name}</h3>
                      <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {plan.duration}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 flex flex-col items-center justify-center py-2 sm:py-4">
                      <div className="flex items-start gap-1 mb-1">
                        <span className="text-slate-400 text-xl font-bold mt-2">$</span>
                        <span className={`text-6xl font-black tracking-tighter transition-colors duration-300 ${
                          selectedPlan === plan.id ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {plan.pricePerDay}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">per day</p>
                        {plan.savings && (
                          <div className="px-4 py-1.5 bg-green-50 text-green-600 text-[11px] font-black rounded-full border border-green-100 shadow-sm uppercase tracking-wider">
                            SAVE {plan.savings}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-50">
                      <div className="text-center mb-2 sm:mb-4">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                          Billed as {plan.billingPeriod}
                        </p>
                      </div>
                      <div className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedPlan === plan.id
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                          : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}>
                        {selectedPlan === plan.id ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Selected
                          </>
                        ) : 'Choose Plan'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features Breakdown */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 p-10 sm:p-16 mt-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight relative">
                Everything you need to <span className="text-blue-600">succeed:</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 relative">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-6 group">
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.25rem] flex items-center justify-center border border-blue-100 flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-sm">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Summary - Right Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
              {/* Guarantee Ribbon */}
              <div className="bg-green-600 text-white text-center py-3 text-[10px] font-black uppercase tracking-[0.3em]">
                30-Day Money Back Guarantee
              </div>
              
              <div className="p-8 sm:p-10">
                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" />
                  Order Summary
                </h3>
                
                {/* Selected Plan Details */}
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center text-slate-600 font-bold pb-6 border-b border-slate-50">
                    <span className="text-sm uppercase tracking-wider">{currentPlan?.name}</span>
                    <span className="text-slate-900">${currentPlan?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 font-black text-3xl pt-2 tracking-tighter">
                    <span>Total Due Today</span>
                    <span className="text-blue-600">${currentPlan?.totalPrice}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-[0.1em]">
                    Billed {currentPlan?.duration} at ${currentPlan?.totalPrice}. Secure transaction. Cancel anytime.
                  </p>
                </div>

                {/* Trust Points */}
                <div className="space-y-5 mb-10">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
                      <Check className="w-4 h-4 text-green-600 stroke-[4px]" />
                    </div>
                    <span>Instant Program Access</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
                      <Check className="w-4 h-4 text-green-600 stroke-[4px]" />
                    </div>
                    <span>One-Click Cancellation</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
                      <Check className="w-4 h-4 text-green-600 stroke-[4px]" />
                    </div>
                    <span>Risk-Free Guarantee</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-red-600 text-sm font-medium flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    {error}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-9 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 hover:shadow-blue-300 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      SECURELY LOADING...
                    </>
                  ) : (
                    <>
                      START MY TRANSFORMATION
                      <Zap className="ml-3 w-6 h-6 fill-current" />
                    </>
                  )}
                </Button>

                {/* Security Indicators */}
                <div className="mt-8 flex flex-col items-center gap-5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    256-Bit SSL Secured Checkout
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Trust Box */}
            <div className="mt-6 bg-slate-900 rounded-3xl p-8 flex items-center gap-5 shadow-xl shadow-slate-200">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Privacy Guarantee</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Your journey is personal. All data is encrypted and 100% HIPAA compliant.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Trust Indicators */}
        <div className="mt-32 py-24 border-t border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">The Science-Backed Leader in Habit Change</h2>
            <p className="text-slate-500 text-lg font-medium">Helping thousands of professionals reclaim their lives every day.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: TrendingUp, value: '98%', label: 'See Improvement' },
              { icon: Users, value: '52k+', label: 'Active Members' },
              { icon: Heart, value: '4.9★', label: 'User Rating' },
              { icon: Shield, value: '100%', label: 'Confidential' },
            ].map((stat, index) => (
              <div key={index} className="text-center group p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter transition-colors group-hover:text-blue-600">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <p className="mt-6 text-slate-400 text-sm max-w-md mx-auto">
            ClarioMind is a science-backed platform designed for high-functioning professionals looking to change their relationship with alcohol.
          </p>
          <div className="mt-8 flex justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <a href="mailto:support@clariomind.com" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <p className="mt-12 text-slate-300 text-[10px] font-medium tracking-widest">
            © 2026 CLARIOMIND INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}