'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Users, 
  Clock,
  ArrowRight,
  Loader2,
  Phone,
  Target,
  Zap,
  Star
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

function UpsellPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleBookCall = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/lukamindjek/new-meeting'
    window.open(calendlyUrl, '_blank')
  }

  const handleSkip = () => {
    router.push('/auth/register')
  }

  const benefits = [
    {
      icon: Target,
      title: 'Personalized Strategy',
      description: 'Get a custom plan tailored to your unique triggers'
    },
    {
      icon: Clock,
      title: 'Accelerated Results',
      description: 'See progress 3x faster with expert guidance'
    },
    {
      icon: Users,
      title: '1-on-1 Support',
      description: 'Direct access to recovery specialists'
    },
    {
      icon: Zap,
      title: 'Breakthrough Techniques',
      description: 'Learn advanced strategies not in the app'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center">
          <Logo size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Success Banner */}
        <div className={`mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-green-700">Payment Successful!</h2>
              <p className="text-sm text-green-600">Welcome to ClarioMind. Your journey begins now.</p>
            </div>
          </div>
        </div>

        {/* Upsell Card */}
        <div className={`transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-center text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Exclusive Offer</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">Accelerate Your Results</h1>
              <p className="text-blue-100">Book a free strategy call with our experts</p>
            </div>

            <div className="p-6 sm:p-8">
              {/* Value Proposition */}
              <div className="text-center mb-8">
                <p className="text-lg text-slate-600 mb-4">
                  Members who combine the app with expert coaching see results <span className="text-blue-600 font-semibold">3x faster</span>.
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <Star className="w-5 h-5 fill-current" />
                  <span>100% Free • No Obligation • 30 Minutes</span>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-50 rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 border border-blue-100">
                      <benefit.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-800 mb-1">{benefit.title}</h3>
                    <p className="text-xs text-slate-500">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* What to Expect */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  What to Expect on the Call
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {[
                    'Review your quiz results and current situation',
                    'Identify your unique triggers and patterns',
                    'Create a personalized action plan',
                    'Answer any questions about your journey'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBookCall}
                  className="w-full py-6 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Book Your Free Call
                </Button>
                
                <button
                  onClick={handleSkip}
                  className="w-full py-4 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
                >
                  Continue to Account Setup →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function UpsellPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <UpsellPageContent />
    </Suspense>
  )
}
