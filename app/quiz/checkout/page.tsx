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
  Calendar,
  Check,
  Zap,
  TrendingUp,
  Heart
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
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm font-semibold">
            <Shield className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:py-12 max-w-6xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Choose Your Path to Recovery</h1>
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">Join 52,000+ professionals who have transformed their relationship with alcohol.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Plan Selection Cards - Left Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
              Select a Subscription Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative cursor-pointer rounded-3xl border-2 transition-all duration-300 bg-white flex flex-col h-full ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-xl'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
                      <div className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap uppercase tracking-wider">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Recommended Badge */}
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
                      <div className="bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`p-6 sm:p-8 flex flex-col flex-1 ${plan.badge || plan.recommended ? 'pt-10' : ''}`}>
                    {/* Header Info */}
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-slate-900 text-xl mb-1">{plan.name}</h3>
                      <div className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {plan.duration}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-slate-400 text-lg">$</span>
                        <span className={`text-5xl font-black tracking-tighter ${
                          selectedPlan === plan.id ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {plan.pricePerDay}
                        </span>
                      </div>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">per day</p>
                      
                      {plan.savings && (
                        <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                          SAVE {plan.savings}
                        </div>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                      <p className="text-slate-400 text-sm mb-4">Total: {plan.billingPeriod}</p>
                      <div className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}>
                        {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features Breakdown */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-12 mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">What's included in your program:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{feature.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Summary - Right Column */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden overflow-visible">
              {/* Guarantee Ribbon */}
              <div className="bg-green-600 text-white text-center py-2.5 text-xs font-bold uppercase tracking-[0.2em]">
                30-Day Money Back Guarantee
              </div>
              
              <div className="p-8 sm:p-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                
                {/* Selected Plan Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-50">
                    <span>{currentPlan?.name}</span>
                    <span>${currentPlan?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 font-bold text-2xl pt-2">
                    <span>Total Due Today</span>
                    <span className="text-blue-600">${currentPlan?.totalPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Billed annually at ${currentPlan?.totalPrice}. You can cancel anytime. No hidden fees.
                  </p>
                </div>

                {/* Trust Points */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-green-600 stroke-[3px]" />
                    </div>
                    <span>Instant full access to program</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-green-600 stroke-[3px]" />
                    </div>
                    <span>Cancel with one click anytime</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-green-600 stroke-[3px]" />
                    </div>
                    <span>Risk-free 30-day guarantee</span>
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
                  className="w-full py-8 rounded-2xl text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Secure Checkout
                      <CheckCircle2 className="ml-3 w-6 h-6" />
                    </>
                  )}
                </Button>

                {/* Security Indicators */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <Lock className="w-3.5 h-3.5" />
                    Secure SSL Encryption
                  </div>
                  <div className="flex items-center gap-6 grayscale opacity-40">
                    <Image src="https://nogqecshcnkaohjrbpns.supabase.co/storage/v1/object/public/assets/stripe-logo.png" alt="Stripe" width={60} height={25} className="h-5 w-auto" />
                    {/* Add more payment icons if available */}
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Trust Box */}
            <div className="mt-6 bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Your privacy is our priority. All data is encrypted and HIPAA compliant.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Trust Indicators */}
        <div className="mt-20 py-16 border-t border-slate-100">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">The Science-Backed Leader in Habit Change</h2>
            <p className="text-slate-500">Helping thousands of professionals reclaim their lives every day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, value: '98%', label: 'See Improvement' },
              { icon: Users, value: '52k+', label: 'Active Professionals' },
              { icon: Heart, value: '4.9★', label: 'User Rating' },
              { icon: Shield, value: '100%', label: 'Confidential' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Logo size="sm" />
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
