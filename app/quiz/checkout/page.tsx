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
import Image from 'next/image'
import Link from 'next/link'

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
    pricePerDay: '1.00',
    totalPrice: '29.99',
    billingPeriod: 'USD 29.99',
    badge: 'Top Choice for Beginners',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_1_MONTH || '',
  },
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
            onClick={() => router.back()}
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
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Choose Your Plan</h1>
          <p className="text-slate-600 text-lg">Start your transformation journey today</p>
        </div>

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`group relative cursor-pointer rounded-[2.5rem] border-2 transition-all duration-300 bg-white flex flex-col h-full ${
                selectedPlan === plan.id
                  ? 'border-blue-500 shadow-2xl shadow-blue-100 ring-4 ring-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-5 py-2 rounded-full shadow-lg whitespace-nowrap uppercase tracking-wider">
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div className="absolute top-6 right-6">
                  <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full border border-green-200 uppercase tracking-tight">
                    Save {plan.savings}
                  </div>
                </div>
              )}

              <div className="p-8 sm:p-10 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6">
                  {/* Radio Circle */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {/* Plan Info */}
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-1 leading-tight">
                    {plan.id.split('-')[0]}-<br />month plan
                  </h3>
                  <p className="text-slate-400 text-sm font-medium mb-4">{plan.duration}</p>
                  
                  {/* Per Day Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-lg font-bold">USD</span>
                    <span className={`text-5xl font-black tracking-tighter ${
                      selectedPlan === plan.id ? 'text-blue-600' : 'text-slate-900'
                    }`}>
                      {plan.pricePerDay}
                    </span>
                    <span className="text-slate-400 text-sm font-medium ml-1">per day</span>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="mt-auto pt-6 border-t border-slate-50">
                  <div className="text-slate-400 text-sm font-medium">
                    USD<br />
                    {plan.totalPrice}
                  </div>
                </div>

                {/* Recommended Section at Bottom */}
                {plan.recommended && (
                  <div className={`mt-6 p-4 rounded-3xl flex items-center gap-3 transition-colors ${
                    selectedPlan === plan.id ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <Sparkles className={`w-4 h-4 ${selectedPlan === plan.id ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold leading-tight ${selectedPlan === plan.id ? 'text-amber-700' : 'text-slate-500'}`}>
                      Recommended for your profile
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Plan Summary Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-12 mb-12 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Your selected plan</p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-black text-slate-900">${currentPlan?.totalPrice}</span>
            <span className="text-slate-400 text-xl font-medium">/{currentPlan?.id.split('-')[0]} months</span>
          </div>
          <p className="text-green-600 font-bold flex items-center justify-center gap-1.5">
            <Check className="w-5 h-5 stroke-[3px]" />
            Only ${currentPlan?.pricePerDay}/day
          </p>
        </div>

        {/* Features Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">What&apos;s included in your program:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-5 group">
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

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sm:p-10">
              <div className="bg-green-600 text-white text-center py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                30-Day Money Back Guarantee
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-600 font-bold pb-4 border-b border-slate-50">
                  <span>{currentPlan?.name}</span>
                  <span>${currentPlan?.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 font-black text-2xl pt-2">
                  <span>Total Due Today</span>
                  <span className="text-blue-600">${currentPlan?.totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-red-600 text-sm font-bold flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-8 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1"
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

              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" />
                  Secure SSL Encryption
                </div>
                <div className="flex items-center gap-6 grayscale opacity-40">
                  <Image src="https://nogqecshcnkaohjrbpns.supabase.co/storage/v1/object/public/assets/stripe-logo.png" alt="Stripe" width={60} height={25} className="h-5 w-auto" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-3xl border border-amber-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-bold">
                Your privacy is our priority. All data is encrypted and HIPAA compliant.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Trust Indicators */}
        <div className="mt-20 py-16 border-t border-slate-100">
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
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Logo size="sm" />
          <p className="mt-6 text-slate-400 text-sm max-w-md mx-auto font-medium">
            ClarioMind is a science-backed platform designed for high-functioning professionals looking to change their relationship with alcohol.
          </p>
          <div className="mt-8 flex justify-center gap-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <a href="mailto:support@clariomind.com" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <p className="mt-12 text-slate-300 text-[10px] font-black tracking-widest uppercase">
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
