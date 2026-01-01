'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo, LogoIcon } from '@/components/ui/logo'
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Shield, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Target,
  Clock,
  LineChart,
  MessageCircle,
  ChevronRight,
  Star,
  Brain
} from 'lucide-react'

function WelcomePageContent() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
    const searchParams = useSearchParams();
    const purchaseAmount = searchParams.get('amount') || '0.00';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  
    const faqs = [  {
      question: "Who is ClarioMind for?",
      answer: "ClarioMind is for high functioning individuals who want to change their relationship with alcohol on their own terms."
    },
    {
      question: "How is ClarioMind different from other sobriety apps?",
      answer: "ClarioMind is specifically designed for high-functioning individuals using neuroscience-based insights from dependency patterns. It addresses the underlying neurological pathways and emotional triggers that keep you returning to alcohol."
    },
    {
      question: "What if I'm not sure I'm a \"high-functioning alcoholic\"?",
      answer: "If you're successful on the outside but struggling privately with alcohol dependence, if traditional recovery models don't resonate, or if you're maintaining functionality while knowing something needs to change, ClarioMind is for you."
    },
    {
      question: "How is my data protected?",
      answer: "All data is encrypted using industry-standard security protocols. We never sell, share, or distribute your personal information to third parties. Your drinking logs and progress data remain completely confidential."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm px-3 sm:px-4">
                Log in
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 sm:px-5 text-xs sm:text-sm">
                Take Quiz
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Science-backed. Professional-grade.</span>
      </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
            Transform Your
            <span className="block text-blue-600 mt-1 sm:mt-2">
              Drinking Habits
            </span>
            <span className="block text-slate-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-1 sm:mt-2">— for Good.</span>
        </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Are you tired of setting rules around drinking that never hold? ClarioMind gives you tools that use neuroscience to help you with your alcohol dependency.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0">
            <Link href="/quiz">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 sm:px-8 py-3.5 sm:py-6 text-sm sm:text-lg shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-200">
                Start Your Journey To Recovery
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login" className="text-slate-500 hover:text-slate-700 transition-colors text-sm sm:text-base">
              Already have an account?
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
            {[
              { value: '80%', label: 'See Results' },
              { value: '10k+', label: 'Professionals' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, i) => (
              <div key={i} className="p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative pb-16 sm:pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8">
              Many professionals use alcohol to decompress, reset, or stay focused through long, high-pressure days. But sometimes, what starts as stress management can turn into dependency.
            </p>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
              And You're <span className="text-blue-600">Not Alone</span> in This
            </h2>
            
            <p className="text-slate-500 mb-10">
              Professionals can develop subtle patterns that associate with alcohol and affect their daily lives and work.
            </p>

            {/* Quiz CTA */}
            <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                Take this 2-Minute Quiz to See Your Dependency Score
              </h3>
              <Link href="/quiz">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 sm:px-8 py-3.5 sm:py-6 text-sm sm:text-base">
                  Take the Quiz
                  <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="text-5xl sm:text-7xl font-bold mb-4">80%</div>
          <p className="text-xl sm:text-2xl text-blue-100">
            of ClarioMind Users Noted a Decrease in alcohol use within 2 months.
          </p>
        </div>
      </section>

      {/* What is ClarioMind */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-6">
              What is <span className="text-blue-600">ClarioMind</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              A science-backed alcohol app made by professionals for professionals. Built on models specifically designed for high-functioning individuals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Why Does it Work?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                ClarioMind was developed by analyzing the patterns of high-functioning alcoholics: their habits, triggers, and cognitive strategies, to identify the core mechanisms behind their dependence.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Neuroscience + Psychology</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                ClarioMind uses personalized, compassionate, evidence-based methods that puts you in control one day at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
            <div className="space-y-6 mb-10">
              {[
                { icon: Target, text: "Flexible goal setting" },
                { icon: LineChart, text: "Drink tracker with daily limits" },
                { icon: Sparkles, text: "Daily motivational quotes" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{feature.text}</span>
                </div>
              ))}
        </div>

            <div className="flex justify-center">
              <Link href="/quiz">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3.5 sm:py-6 text-sm sm:text-lg">
                  Start Your Journey To Recovery Today
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Does it Work */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-800">
              How Does it Work
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "We get to know you",
                description: "Tell us about your triggers, your goals, and what's been holding you back.",
                icon: Target
              },
              {
                step: "02",
                title: "You learn why you drink",
                description: "Five minutes a day. Short, practical lessons about the neuroscience of habits.",
                icon: Brain
              },
              {
                step: "03",
                title: "You track what matters",
                description: "See your progress in real-time. Celebrate the wins. Watch your life change.",
                icon: LineChart
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="text-sm font-mono text-blue-600 mb-4">{item.step}</div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-800">
              What You'll Get Inside
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              {
                icon: Clock,
                title: "Daily 5-minute Lessons",
                description: "Understand how alcohol affects your brain and why changing creates lasting transformation."
              },
              {
                icon: Users,
                title: "24/7 Anonymous Community",
                description: "Connect with thousands on the same path. Celebrate wins, get support during tough moments."
              },
              {
                icon: LineChart,
                title: "Personalized Tracking",
                description: "Monitor your progress in real-time and watch as data proves your transformation."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Note card */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
            <p className="text-amber-800 font-medium">
              <strong>Track slip-ups without losing progress.</strong> Log drinks without resetting your start date. One setback shouldn't erase all your work.
            </p>
          </div>
        </div>
      </section>

      {/* Your Why Section */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-4">
              Your "<span className="text-blue-600">Why</span>" is Your Power
            </h2>
            <h3 className="text-xl text-slate-600">
              What brought you here?
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm mb-10">
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Maybe it's the 3 PM crash after a "productive" morning. Or the fog during meetings. The way you've started needing alcohol to function. Or maybe it's something you're moving towards — a sharper focus, genuine energy, showing up as the person you know you can be.
            </p>
            <p className="text-slate-800 font-medium text-lg">
              ClarioMind helps you name it, explore the real reasons behind your decision to change.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl text-blue-600 font-semibold mb-8">
              When your "why" is clear, your journey of sobriety becomes easier to navigate.
            </p>
            <Link href="/quiz">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 sm:px-10 py-3.5 sm:py-6 text-sm sm:text-lg shadow-lg shadow-blue-200">
                Start Your Journey To Recovery
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-800">
              FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-slate-50 rounded-2xl border transition-all duration-300 ${
                  openFaq === index ? 'border-blue-200' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to transform your life?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who've already started their journey with ClarioMind.
          </p>
          
          <Link href="/quiz">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-6 sm:px-10 py-3.5 sm:py-6 text-sm sm:text-lg shadow-lg">
              Start Your Journey To Recovery
              <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 sm:py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
            <Logo size="md" />

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 text-center">
              <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
              <span>© 2024 ClarioMind. All rights reserved.</span>
            </div>
          </div>
      </div>
      </footer>
    </div>
  )
}

  export default function WelcomePage() {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-clario-600 to-clario-700" />}>
        <WelcomePageContent />
      </Suspense>
    )
  }
