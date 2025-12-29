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
  const sessionId = searchParams.get('session_id')
  
  // Only track if we have a session_id (user just completed payment)
  if (sessionId && typeof window !== 'undefined' && (window as any).fb) {
    // Fetch session details to get purchase amount
    fetch(`/api/stripe/get-session?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.amount_total) {
          // Convert from cents to dollars
          // Convert from cents to dollars and fire Purchase event
          // Fire Facebook Purchase event - inline calculation to avoid TypeScript issues
          (window as any).fbq('track', 'Purchase', {
            value: Number((data.amount_total || 0) / 100),
            currency: data.currency?.toUpperCase() || 'USD'
          })
        }
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

  const testimonials = [
    {
      name: 'Michael T.',
      role: 'Senior Executive',
      quote: 'Having regular coaching calls helped me stay accountable when the app alone wasn\'t enough. My coach helped me build strategies I actually use every day.'
    },
    {
      name: 'Sarah L.',
      role: 'Marketing Director',
      quote: 'The coaching session transformed how I use ClarioMind. Now I have a clear plan and someone who understands my specific challenges.'
    }
  ]

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-clario-600 to-clario-700 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-clario-600 to-clario-700">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="white" size="md" />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-clario-300" />
              <span className="text-sm text-white font-medium">Exclusive Welcome Offer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get a Free 1:1 Success Consultation
            </h1>
            <p className="text-xl text-clario-100 max-w-2xl mx-auto">
              Research shows people who receive personalized coaching are{' '}
              <span className="font-semibold text-white">3x more likely</span>{' '}
              to maintain long-term sobriety
            </p>
          </div>

          {/* Social Proof */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-clario-500 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Why Most People Struggle With Recovery Apps Alone
                </h3>
                <p className="text-clario-100 mb-4">
                  Last year, we surveyed 500+ ClarioMind users who started strong but eventually stopped using the app:
                </p>
                <ul className="space-y-2">
                  {userChallenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-clario-100">
                      <span className="text-clario-300 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-white font-medium mt-4">
                  The common thread? They didn\'t have anyone to help them work through the hard moments.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              What You\'ll Get in Your Free Consultation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {consultationBenefits.map((benefit, idx) => {
                const IconComponent = benefit.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-clario-500 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-clario-100 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              What Other Members Are Saying
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <Quote className="w-8 h-8 text-clario-300 mb-4" />
                  <p className="text-white mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-clario-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Book Your Free Consultation Now
              </h2>
              <p className="text-gray-600">
                Choose a time that works for your schedule
              </p>
            </div>

            {/* Calendly Embed */}
            <CalendlyEmbed />
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white text-sm underline transition-colors"
            >
              Skip for now and go to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpsellPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-clario-600 to-clario-700 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <UpsellPageContent />
    </Suspense>
  )
}
