'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Loader2,
  Target,
  Zap,
  Shield,
  Brain,
  BadgeCheck,
  Quote
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { CalendlyEmbed } from '@/components/ui/calendly-embed'

function UpsellPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

    // Track Facebook Purchase event when user arrives from successful payment
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    // Only track if we have a session_id (user just completed payment)
    if (sessionId && typeof window !== 'undefined' && (window as any).fbq) {
      // Fetch session details to get purchase amount
      fetch(`/api/stripe/get-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.amount_total) {
            // Convert from cents to dollars
            // Convert from cents to dollars and fire Purchase event
            const purchaseValue = parseFloat(((data.amount_total || 0) / 100).toFixed(2))            // Fire Facebook Purchase event
            (window as any).fbq('track', 'Purchase', {
              value: purchaseValue,              currency: data.currency?.toUpperCase() || 'USD'
            })
            
            console.log('[FB Pixel] Purchase event tracked:', purchaseValue, data.currency)          }
        })
        .catch(err => console.error('[FB Pixel] Error tracking purchase:', err))
    }
  }, [searchParams])

  const handleSkip = () => {
    router.push('/auth/register')
  }

  const consultationBenefits = [
    {
      icon: Target,
      title: 'Get Personalized Help Tailored to Your Unique Situation and Goals',
      description: 'Receive one-on-one guidance that addresses your specific challenges, lifestyle, and recovery objectives.'
    },
    {
      icon: Shield,
      title: 'Learn How to Navigate Recovery Without Losing Your Professional Identity',
      description: 'Change your relationship with alcohol while maintaining the life you\'ve built. Learn how to integrate recovery into your existing lifestyle.'
    },
    {
      icon: Brain,
      title: 'Explore the Deep Connections Between Stress, Triggers, and Your Drinking Patterns',
      description: 'Go beyond surface-level tracking to understand what\'s really driving your dependency.'
    },
    {
      icon: Zap,
      title: 'Master Techniques to Interrupt Cravings Before They Control Your Decisions',
      description: 'Learn practical interventions for real-life situations like client dinners, stressful workdays, and social events.'
    },
    {
      icon: Calendar,
      title: 'Build a Personalized Recovery System That Fits Your Life',
      description: 'Learn how to create sustainable routines and accountability structures designed around your schedule and goals.'
    }
  ]

  const userChallenges = [
    'They kept falling into old patterns after a couple of months',
    'They started feeling overwhelmed',
    'They started hiding their drinking from the app (and themselves) again'
  ]

  const isForYou = [
    "You've tried cutting back on your own, but stress, travel, or long workdays keep pulling you back into old patterns.",
    "You want structured accountability from an expert who understands executives, confidentiality, and the pressure you operate under.",
    "You're ready for measurable change—better sleep, clearer thinking, improved health, and a relationship with alcohol that no longer controls your life."
  ]

  const whatYouGet = [
    'A Free consult with our sobriety experts',
    'A community of likeminded individuals',
    'Access to full benefits without additional charges',
    'No monthly subscriptions',
    'Weekly check-ins',
    'Priority emergency meetings'
  ]

  const howItWorks = [
    {
      title: 'Schedule a call with our expert',
      items: [
        'Choose a time that fits your schedule.',
        'Get matched with an expert trained in executive-level addiction recovery who understands high-pressure lifestyles.',
        'Discuss your goals discreetly and map out the first steps toward managing your alcohol use.'
      ]
    },
    {
      title: 'Learn how to stay consistent with weekly check-ins',
      items: [
        'Progress and highlights',
        'Set goals for the week',
        'Adjust your strategy weekly'
      ]
    },
    {
      title: 'Achieve your sobriety goals',
      items: [
        'Build sustainable habits',
        'Track measurable improvements'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
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
              <h2 className="font-bold text-green-700 text-lg">Congratulations on taking the first step to recovery!</h2>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
            <p className="text-blue-800 text-lg">
              <span className="font-bold text-2xl text-blue-600">98%</span> of our users have reported excellent results with ClarioMind.
            </p>
          </div>
        </div>

        {/* User Challenges */}
        <div className={`mb-8 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-slate-700 mb-4 text-center">However, some users reported that:</p>
          <div className="space-y-3">
            {userChallenges.map((challenge, index) => (
              <div key={index} className="bg-slate-100/80 border-l-4 border-slate-400 rounded-r-xl p-4">
                <p className="text-slate-600 italic flex items-start gap-2">
                  <Quote className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className={`mb-8 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-slate-700 mb-4 text-center">
            When we reviewed these patterns, one thing became clear: <span className="font-semibold text-blue-600">recovery sometimes needs more support and more accountability.</span>
          </p>
          <p className="text-slate-600 text-center">
            That's why we added something to support you beyond the app, something built specifically for high-performing professionals who want discreet, structured, continuous guidance.
          </p>
        </div>

        {/* Offer Card */}
        <div className={`transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Free Consultation</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">A Free Consultation with our experts</h1>
              <p className="text-blue-100">(No hidden charges)</p>
            </div>

            <div className="p-6 sm:p-8">
              {/* Consultation Benefits */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-slate-800 mb-4 text-center">In this Consultation, you will be able to:</h3>
                <div className="space-y-6">
                  {consultationBenefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-slate-500">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 text-center">
                <p className="text-slate-700 font-medium">
                  Structured, confidential guidance built for professionals who need clarity, direction, and consistency.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className={`mb-8 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">How it works</h2>
            <div className="space-y-6">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                      <ul className="space-y-2">
                        {step.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-8 bg-blue-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* This is for you if */}
        <div className={`mb-8 transition-all duration-700 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">This is for you if:</h2>
            <div className="space-y-4">
              {isForYou.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <BadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's holding you back */}
        <div className={`mb-8 transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold mb-4 text-center">What's holding you back…</h2>
            <p className="text-slate-300 text-center mb-4">If you're honest with yourself, you already know this:</p>
            <div className="space-y-2 text-center">
              <p className="text-slate-200">There's no single shortcut.</p>
              <p className="text-slate-200 font-semibold text-lg">No app can fully replace human accountability.</p>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className={`mb-8 transition-all duration-700 delay-[800ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold mb-6 text-center">You Get:</h2>
            <div className="grid gap-3">
              {whatYouGet.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Embedded Calendly */}
        <div id="calendly-section" className={`mb-8 transition-all duration-700 delay-[900ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-center text-white rounded-t-3xl">
              <h2 className="text-xl font-bold">Book Your Free Consultation</h2>
              <p className="text-blue-100 text-sm mt-1">Select a time that works for you</p>
            </div>
            <CalendlyEmbed />
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="py-4 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
          >
            Skip for now and continue to Account Setup →
          </button>
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
