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
  Zap
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

function CheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState('')

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
    }
  ]

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
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
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Pricing Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-3">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Unlock ClarioMind</h1>
            <p className="text-blue-100">Start your recovery journey today</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-slate-800">$49</span>
                <span className="text-slate-500 text-lg">/lifetime</span>
              </div>
              <p className="text-sm text-slate-400">One-time payment. No subscriptions.</p>
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
              { value: '80%', label: 'See improvement' },
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
